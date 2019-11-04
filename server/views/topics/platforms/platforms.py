import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import arguments_required, api_error_handler, filters_from_args, json_error_response
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
    result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id = platform_id)
    return jsonify({"results": result})