import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import api_error_handler
from server.auth import user_mediacloud_client

logger = logging.getLogger(__name__)

OPEN_WEB = 1


@app.route('/api/topics/platforms/all', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_platform_list():
    return jsonify({'results': [{'type': 'web', 'platform_seed_query': 'dummy'}, {'type': 'reddit', 'platform_seed_query': 'dummy'}, {'type': 'twitter', 'platform_seed_query': 'dummy'}]})


@app.route('/api/topics/<topics_id>/platforms/list', methods=['GET'])
@flask_login.login_required
def get_topic_platforms(topics_id):
    # media_type_tags = tags_in_tag_set(TOOL_API_KEY, TAG_SETS_ID_MEDIA_TYPE)
    # how do we get all the seed queries per topic ?
    #merge what the topic has versus what the topic doens't by adding in the topic_seed_queries_id
    return jsonify({'results': [{'id':56, 'type': 'web', 'platform_seed_query': 'storytelling'}, {'type': 'reddit', 'platform_seed_query': 'dummy'}, {'type': 'twitter', 'platform_seed_query': 'dummy'}]})


# maybe push this to js, we'll see
@app.route('/api/topics/<topics_id>/platforms/<platform_id>', methods=['GET'])
@flask_login.login_required
def get_platform_by_id(topics_id, platform_id):
    # iterate through topic seed queries array
    return jsonify({'id':56, 'type': 'web', 'platform_seed_query': 'storytelling'}) #need media_ids


@app.route('/api/topics/<topics_id>/platforms/add', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_add_platform(topics_id):
    user_mc = user_mediacloud_client()
    platform = request.form['current_platform_type']
    query = request.form['platform_query']

    source = request.form['source'] if 'source' in request.form else None
    # do we need to add dates?
    result = user_mc.topicAddSeedQuery(topics_id, platform, source, query)
    result['success'] = result['topic_seed_query']['topic_seed_queries_id']
    return jsonify(result) #topic_seed_queries_id


@app.route('/api/topics/<topics_id>/platforms/<platform_id>/update', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_update_platform(topics_id, platform_id):
    user_mc = user_mediacloud_client()
    platform = request.form['current_platform_type']
    query = request.form['platform_query']

    source = request.form['source'] if 'source' in request.form else None
    #TODO update or remove/add?
    # remove id, add new, return new id
    #result = user_mc.topicUpdateSeedQuery(topics_id, platform_id, source, query)
    #result['success'] = result['topic_seed_query']['topic_seed_queries_id']
    result = {"nothing"}
    return jsonify(result) #topic_seed_queries_id


@app.route('/api/topics/<topics_id>/platforms/remove', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_remove_platform(topics_id, platform_id):
    user_mc = user_mediacloud_client()
    query = request.form['platform_query']
    result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id = platform_id)
    return jsonify({"results": result})
