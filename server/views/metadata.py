import logging
import flask_login
from flask import jsonify, request

from server import app
from server.auth import user_mediacloud_key
from server.util.request import arguments_required, api_error_handler
from server.views.sources.apicache import tags_in_tag_set

logger = logging.getLogger(__name__)


@app.route('/api/metadata/<tag_sets_id>/values', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_metadata_values(tag_sets_id):
    '''
    Source metadata is encoded in various tag sets - this returns the set and the list of
    available tags you can use
    '''
    data = tags_in_tag_set(user_mediacloud_key(), tag_sets_id, False, True)  # use the file-based cache here
    return jsonify(data)


@app.route('/api/metadata/<tag_sets_id>/search', methods=['GET'])
@arguments_required("name")
@flask_login.login_required
@api_error_handler
def api_metadata_search(tag_sets_id):
    search_string = request.args['name']
    # search by ourselves in the file-based cache of all the tags (faster than asking the API to do it over and over)
    data = tags_in_tag_set(user_mediacloud_key(), tag_sets_id, False, True)
    matching_tags = [t for t in data['tags'] if search_string in t['label'].lower()]
    return jsonify(matching_tags)
