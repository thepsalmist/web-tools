import logging
from flask import jsonify, request
import flask_login

from server import app, TOOL_API_KEY
from server.views import TAG_COUNT_SAMPLE_SIZE
from server.util.request import api_error_handler, json_error_response, form_fields_required
from server.views.topics.apicache import topic_story_count
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.foci import FOCAL_TECHNIQUE_BOOLEAN_QUERY
from server.util.tags import tags_in_tag_set, TAG_SETS_ID_MEDIA_TYPE

logger = logging.getLogger(__name__)

PLATFORM_OPEN_WEB = '*'  # how are we distinguishing platform ids etc? How does it affect the way we searchour API?

@app.route('/api/topics/<topics_id>/platforms/open-web/story-counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def open_web_story_counts(topics_id):
    tag_story_counts = []
    media_type_tags = tags_in_tag_set(TOOL_API_KEY, PLATFORM_OPEN_WEB)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # make a count for each tag based on media_id
    for tag in media_type_tags:
        query_clause = "tags_id_media:{}".format(tag['tags_id'])
        tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=query_clause)['count']
        tag_story_counts.append({
            'label': tag['label'],
            'tags_id': tag['tags_id'],
            'count': tagged_story_count,
            'pct': float(tagged_story_count)/float(total_stories) if total_stories > 0 else 0, # protect against div by zero
        })

    return jsonify({'story_counts': tag_story_counts})


@app.route('/api/topics/<topics_id>/platforms/open-web/coverage', methods=['GET'])
@flask_login.login_required
@api_error_handler
def open_web_coverage(topics_id):
    media_type_tags = tags_in_tag_set(TOOL_API_KEY, PLATFORM_OPEN_WEB)
    # grab the total stories
    total_stories = topic_story_count(user_mediacloud_key(), topics_id)['count']
    # count the stories in any media in tagged as media_type
    tags_ids = " ".join(str(tag['tags_id']) for tag in media_type_tags)
    query_clause = "tags_id_media:({})".format(tags_ids)
    tagged_story_count = topic_story_count(user_mediacloud_key(), topics_id, q=query_clause)['count']
    return jsonify({'counts': {'count': tagged_story_count, 'total': total_stories}})


@app.route('/api/topics/<topics_id>/platforms/open-web/create', methods=['POST'])
@form_fields_required('focalSetName', 'focalSetDescription')
@flask_login.login_required
def create_open_web_platform(topics_id):
    user_mc = user_mediacloud_client()
    # grab the focalSetName and focalSetDescription and then make one
    # do somethings, but return dummy for now
    return {'success': True}

@app.route('/api/platforms/list', methods=['GET'])
@flask_login.login_required
def get_platform_types():
    # media_type_tags = tags_in_tag_set(TOOL_API_KEY, TAG_SETS_ID_MEDIA_TYPE)
    return jsonify({'results': [{type: 'open web'}, {type: 'reddit'}, {type: 'twitter'}]})