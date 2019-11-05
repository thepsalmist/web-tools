import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import api_error_handler, form_fields_required
from server.auth import user_mediacloud_client, user_mediacloud_key
from server.views.topics import apicache as apicache
from server.views.topics.apicache import topic_focal_sets_list

logger = logging.getLogger(__name__)

OPEN_WEB = 1

@app.route('/api/topics/<topics_id>/platforms/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_platform_list(topics_id):
    return jsonify({"results": [{"id": OPEN_WEB, "name": "open web"}]})


@app.route('/api/topics/<topics_id>/platforms/add', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_add_platform(topics_id):
    user_mc = user_mediacloud_client()
    platform = request.form['platform']
    query = request.form['platform_query']
    source = request.form['source'] if 'source' in request.form else None
    result = user_mc.topicAddSeedQuery(topics_id, platform, source, query)
    return jsonify({"results": result}) #topic_seed_queries_id

@app.route('/api/topics/<topics_id>/platforms/remove', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_remove_platform(topics_id, platform_id):
    user_mc = user_mediacloud_client()
    query = request.form['platform_query']
    result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id = platform_id)
    return jsonify({"results": result})

@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    user_mc = user_mediacloud_client()

    #will do something conditional depending on platform
    platform = request.args['current_platform']

    platform_query = request.args['platform_query']
    num_stories = request.args['limit']
    story_count_result = user_mc.storyList(solr_query=platform_query, sort=user_mc.SORT_RANDOM, rows=num_stories)
    return jsonify(story_count_result)


@app.route('/api/topics/<topics_id>/platforms/preview/story-count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_count(topics_id):
    user_mc = user_mediacloud_client()
    #will do something conditional depending on platform
    platform = request.args['current_platform']

    platform_query = request.args['platform_query']
    # get inherited topic dates and send them along w
    story_count_result = user_mc.storyCount(solr_query=platform_query)
    return jsonify(story_count_result)