import logging
from flask import jsonify, request
import flask_login

from server import app, TOOL_API_KEY
from server.util.request import api_error_handler, json_error_response, form_fields_required
from server.views.topics.apicache import topic_story_count
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.util.tags import tags_in_tag_set, TAG_SETS_ID_RETWEET_PARTISANSHIP_2016
from server.views.topics.foci import FOCAL_TECHNIQUE_BOOLEAN_QUERY

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/focal-sets/retweet-partisanship/preview/story-counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def retweet_partisanship_story_counts(topics_id):
    # TODO: add in overall timespan id here so it works in different snapshots
    tag_story_counts = []
    partisanship_tags = _cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # make a count for each tag
    for tag in partisanship_tags:
        tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=tag['query'])['count']
        try:
            pct = float(tagged_story_count)/float(total_stories)
        except ZeroDivisionError:
            pct = 0
        tag_story_counts.append({
            'label': tag['label'],
            'tags_id': tag['tags_id'],
            'count': tagged_story_count,
            'pct': pct
        })
    # order them in the way a person would expect ( left to center to right)
    ordered_tag_story_counts = list()
    ordered_tag_story_counts.append([t for t in tag_story_counts if t['tags_id'] == 9360520][0])
    ordered_tag_story_counts.append([t for t in tag_story_counts if t['tags_id'] == 9360521][0])
    ordered_tag_story_counts.append([t for t in tag_story_counts if t['tags_id'] == 9360522][0])
    ordered_tag_story_counts.append([t for t in tag_story_counts if t['tags_id'] == 9360523][0])
    ordered_tag_story_counts.append([t for t in tag_story_counts if t['tags_id'] == 9360524][0])
    return jsonify({'story_counts': ordered_tag_story_counts})


@app.route('/api/topics/<topics_id>/focal-sets/retweet-partisanship/preview/coverage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def retweet_partisanship_coverage(topics_id):
    partisanship_tags = _cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # count the stories in any media in tagged as partisan
    tags_ids = " ".join([str(t['tags_id']) for t in partisanship_tags])
    tags_ids_query_clause = "tags_id_media:({})".format(tags_ids)
    tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=tags_ids_query_clause)['count']
    return jsonify({'counts': {'count': tagged_story_count, 'total': total_stories}})


def _cached_media_tags(tag_sets_id):
    partisanship_tags = tags_in_tag_set(TOOL_API_KEY, tag_sets_id)
    for tag in partisanship_tags:
        tag['query'] = "tags_id_media:{}".format(tag['tags_id'])
    return partisanship_tags


@app.route('/api/topics/<topics_id>/focal-sets/retweet-partisanship/create', methods=['POST'])
@form_fields_required('focalSetName', 'focalSetDescription')
@flask_login.login_required
def create_retweet_partisanship_focal_set(topics_id):
    user_mc = user_mediacloud_client()
    # grab the focalSetName and focalSetDescription and then make one
    focal_set_name = request.form['focalSetName']
    focal_set_description = request.form['focalSetDescription']
    focal_technique = FOCAL_TECHNIQUE_BOOLEAN_QUERY
    new_focal_set = user_mc.topicFocalSetDefinitionCreate(topics_id, focal_set_name, focal_set_description,
                                                          focal_technique)
    if 'focal_set_definitions_id' not in new_focal_set:
        return json_error_response('Unable to create the subtopic set')
    # now make the foci in it - one for each partisanship quintile
    partisanship_tags = _cached_media_tags(TAG_SETS_ID_RETWEET_PARTISANSHIP_2016)
    for tag in partisanship_tags:
        name = tag['label']
        description = "Media sources that were retweeted more often during the 2016 US election " \
                      "season by people on the {}".format(tag['label'])
        query = tag['query']
        focal_set_definitions_id = new_focal_set['focal_set_definitions_id']
        # create a new boolean query subtopic based on the tag sets
        new_focus = user_mc.topicFocusDefinitionCreate(topics_id,
                                                       name=name, description=description, query=query,
                                                       focal_set_definitions_id=focal_set_definitions_id)
        if (len(new_focus) == 0) or ('focus_definitions_id' not in new_focus[0]):
            return json_error_response('Unable to create the {} subtopic'.format(name))
    return {'success': True}
