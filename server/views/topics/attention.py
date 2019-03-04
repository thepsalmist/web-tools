import logging
from operator import itemgetter

import flask_login
from flask import jsonify

import server.util.csv as csv
import server.views.topics.apicache as apicache
from server import app, TOOL_API_KEY
from server.auth import user_mediacloud_key, is_user_logged_in
from server.util.request import api_error_handler
from server.util.stringutil import trimSolrDate
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/split-story/count', methods=['GET'])
@api_error_handler
def topic_split_story_count(topics_id):
    if access_public_topic(topics_id):
        results = apicache.topic_split_story_counts(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None, foci_id=None,q=None)
    elif is_user_logged_in():
        results = apicache.topic_split_story_counts(user_mediacloud_key(), topics_id)
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})

    return jsonify({'results': results})


@app.route('/api/topics/<topics_id>/split-story/count.csv', methods=['GET'])
@flask_login.login_required
def topic_story_count_csv(topics_id):
    return stream_topic_split_story_counts_csv(user_mediacloud_key(), 'splitStoryCounts-Topic-' + topics_id, topics_id)


def stream_topic_split_story_counts_csv(user_mc_key, filename, topics_id, **kwargs):
    results = apicache.topic_split_story_counts(user_mc_key, topics_id, **kwargs)
    clean_results = [{'date': trimSolrDate(item['date']), 'stories': item['count']} for item in results['counts']]
    sorted_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'stories']
    return csv.stream_response(sorted_results, props, filename)


