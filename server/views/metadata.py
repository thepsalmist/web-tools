import logging
import flask_login
from flask import jsonify, request

from server import app
from server.auth import user_mediacloud_key
from server.util.request import arguments_required, api_error_handler
from server.views.sources.apicache import tags_in_tag_set
from server.util.tags import TAG_SETS_ID_PUBLICATION_COUNTRY, TAG_SETS_ID_PUBLICATION_STATE, TAG_SETS_ID_COUNTRY_OF_FOCUS, TAG_SETS_ID_PRIMARY_LANGUAGE
logger = logging.getLogger(__name__)

PUBLICATION_COUNTRY_DEFAULTS = [{'label':'United States', 'tags_id': 9353663, 'tag_sets_id': 1935, 'tag_set_label':'Publication Country'}, {'label': 'Japan', 'tags_id': 9353544, 'tag_sets_id': 1935, 'tag_set_label': 'Publication Country'}, {'label': 'Australia', 'tags_id': 9353443, 'tag_sets_id': 1935, 'tag_set_label': 'Publication Country'}, {'label': 'China', 'tags_id': 9353472, 'tag_sets_id': 1935}, {'label': 'Russia', 'tags_id': 9353618, 'tag_sets_id': 1935, 'tag_set_label': 'Publication Country'}]
PUBLICATION_STATE_DEFAULTS = [{'label':'Massachusetts', 'tags_id': 9360578, 'tag_sets_id': 1962, 'tag_set_label':'Publication State'}, {'label': 'Georgia', 'tags_id': 9360565, 'tag_sets_id': 1962, 'tag_set_label':'Publication State'}]
PRIMARY_LANGUAGE_DEFAULTS = [{'label': 'spanish', 'tags_id': 9361427, 'tag_sets_id': 1969, 'tag_set_label':'Primary Language'}, {'label': 'english', 'tags_id': 9361422, 'tag_sets_id': 1969, 'tag_set_label':'Primary Language'}]
COUNTRY_OF_FOCUS_DEFAULTS = [{'label':'USA', 'tags_id': 9361596, 'tag_sets_id':1970, 'tag_set_label':'Country Of Focus' }, {'label': 'Spain', 'tags_id': 9361893, 'tag_sets_id': 1970, 'tag_set_label':'Country Of Focus'}]

@app.route('/api/metadata/<tag_sets_id>/values', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_metadata_values(tag_sets_id):
    '''
    Source metadata is encoded in various tag sets - this returns the set and the list of
    available tags you can use
    '''
    data = tags_in_tag_set(user_mediacloud_key(), tag_sets_id, False, True)  # use the file-based cache here
    data['short_list'] = get_metadata_defaults(tag_sets_id)
    return jsonify(data)


@app.route('/api/metadata/<tag_sets_id>/search', methods=['GET'])
@arguments_required("name")
@flask_login.login_required
@api_error_handler
def api_metadata_search(tag_sets_id):
    search_string = request.args['name']
    # search by ourselves in the file-based cache of all the tags (faster than asking the API to do it over and over)
    data = tags_in_tag_set(user_mediacloud_key(), tag_sets_id, False, True)
    matching_tags = [t for t in data['tags'] if search_string.lower() in t['label'].lower()]
    return jsonify(matching_tags)


def get_metadata_defaults(tag_sets_id):
    short_list = []
    if int(tag_sets_id) == TAG_SETS_ID_PUBLICATION_COUNTRY:
        short_list = PUBLICATION_COUNTRY_DEFAULTS
    if int(tag_sets_id) == TAG_SETS_ID_PUBLICATION_STATE:
        short_list = PUBLICATION_STATE_DEFAULTS
    if int(tag_sets_id) == TAG_SETS_ID_PRIMARY_LANGUAGE:
        short_list = PRIMARY_LANGUAGE_DEFAULTS
    if int(tag_sets_id) == TAG_SETS_ID_COUNTRY_OF_FOCUS:
        short_list = COUNTRY_OF_FOCUS_DEFAULTS
    return short_list