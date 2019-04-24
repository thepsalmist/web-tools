import logging

import flask_login
import mediacloud.error
from flask import jsonify, request

import server.views.apicache as shared_apicache
import server.views.topics.apicache as apicache
from server import app, mc
from server.auth import user_mediacloud_key, user_mediacloud_client, is_user_logged_in, user_name
from server.util.request import api_error_handler, arguments_required
from server.views.topics import access_public_topic
from server.views.topics import concatenate_query_for_solr, concatenate_solr_dates
from server.views.topics.topiclist import add_user_favorite_flag_to_topics

logger = logging.getLogger(__name__)

ARRAY_BASE_ONE = 1


@app.route('/api/topics/<topics_id>/summary', methods=['GET'])
@api_error_handler
def topic_summary(topics_id):
    topic = _topic_summary(topics_id)
    try:
        topic['seed_query_story_count'] = shared_apicache.story_count(
            user_mediacloud_key(),
            q=concatenate_query_for_solr(solr_seed_query=topic['solr_seed_query'],
                                         media_ids=[m['media_id'] for m in topic['media']],
                                         tags_ids=[t['tags_id'] for t in topic['media_tags']]),
            fq=concatenate_solr_dates(start_date=topic['start_date'], end_date=topic['end_date'])
        )['count']
    except mediacloud.error.MCException:
        # the query syntax is wrong (perhaps pre-story-level search
        topic['seed_query_story_count'] = 'unknown'
    return jsonify(topic)


def _topic_summary(topics_id):
    if access_public_topic(topics_id):
        local_mc = mc
    elif is_user_logged_in():
        local_mc = user_mediacloud_client()
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    topic = local_mc.topic(topics_id)
    # add in snapshot list (with version numbers, by date)
    snapshots = local_mc.topicSnapshotList(topics_id)
    snapshots = sorted(snapshots, key=lambda d: d['snapshot_date'])
    for idx in range(0, len(snapshots)):
        if snapshots[idx]['note'] in [None, '']:
            snapshots[idx]['note'] = idx + ARRAY_BASE_ONE
    topic['snapshots'] = {
        'list': snapshots,
    }
    if is_user_logged_in():
        add_user_favorite_flag_to_topics([topic])
    return topic


@app.route('/api/topics/<topics_id>/snapshots/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_snapshots_list(topics_id):
    user_mc = user_mediacloud_client()
    snapshots = user_mc.topicSnapshotList(topics_id)
    # if note is missing
    for idx in range(0, len(snapshots)):
        if snapshots[idx]['note'] in [None, '']:
            snapshots[idx]['note'] = idx
    snapshot_status = mc.topicSnapshotGenerateStatus(topics_id)['job_states']  # need to know if one is running
    latest = snapshots[:-1]
    return jsonify({'list': snapshots, 'jobStatus': snapshot_status, 'latestVersion': latest['note']})


@app.route('/api/topics/<topics_id>/snapshots/<snapshots_id>/timespans/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_timespan_list(topics_id, snapshots_id):
    foci_id = request.args.get('focusId')
    timespans = apicache.cached_topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id, foci_id)
    return jsonify({'list': timespans})


@app.route('/api/topics/<topics_id>/update-settings', methods=['PUT'])
@flask_login.login_required
@api_error_handler
def topic_update_settings(topics_id):
    user_mc = user_mediacloud_client()
    args = {
        'name': request.form['name'] if 'name' in request.form else None,
        'description': request.form['description'] if 'description' in request.form else None,
        'is_public': request.form['is_public'] if 'is_public' in request.form else None,
        'is_logogram': request.form['is_logogram'] if 'is_logogram' in request.form else None,
    }
    result = user_mc.topicUpdate(topics_id, **args)
    return topic_summary(result['topics'][0]['topics_id'])  # give them back new data, so they can update the client
