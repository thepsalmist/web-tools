import logging
from flask import jsonify, request
import flask_login
import json

from server import app
from server.util.request import api_error_handler, arguments_required
import server.util.dates as date_util
from server.platforms import provider_for, PLATFORM_REDDIT, PLATFORM_OPEN_WEB, PLATFORM_SOURCE_MEDIA_CLOUD, \
    PLATFORM_TWITTER, PLATFORM_SOURCE_CRIMSON_HEXAGON, PLATFORM_GENERIC, PLATFORM_SOURCE_CSV

logger = logging.getLogger(__name__)


def _info_from_request():
    """
    Load all the info we need out of the request so we can make every preview method as generic as possible
    :return:
    """
    platform = request.args['platform_type']
    source = request.args['platform_source']
    provider = provider_for(platform, source)
    query = request.args['platform_query']
    channel = request.args['platform_channel'] if 'platform_channel' in request.args else ''
    start_date, end_date = _parse_query_dates()
    options = {}
    if platform == PLATFORM_REDDIT:
        options = {'subreddits': json.loads(channel)}
    elif (platform == PLATFORM_OPEN_WEB) and (source == PLATFORM_SOURCE_MEDIA_CLOUD):
        media = json.loads(channel)
        sources = media['sources[]'] if 'sources[]' in media and 'sources' not in [None, ''] else ''
        collections = media['collections[]'] if 'collections[]' in media else ''
        options = {'sources': sources, 'collections': collections}
    elif (platform == PLATFORM_TWITTER) and (source == PLATFORM_SOURCE_CRIMSON_HEXAGON):
        options = {'monitor_id': query}
        query = ''
    elif (platform == PLATFORM_GENERIC) and (source == PLATFORM_SOURCE_CSV):
        # in this case, the temp server filename is stored in the query field
        options = {}
        provider.set_filename(query)
        query = ''
    return provider, query, start_date, end_date, options


@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    provider, query, start_date, end_date, options = _info_from_request()
    content_list = provider.sample(query, start_date, end_date, **options)
    return jsonify(content_list)


@app.route('/api/topics/<topics_id>/platforms/preview/story-count', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_total_content(topics_id):
    provider, query, start_date, end_date, options = _info_from_request()
    content_count = provider.count(query, start_date, end_date, **options)
    return jsonify({'count': content_count})


@app.route('/api/topics/<topics_id>/platforms/preview/attention', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_split_story_count(topics_id):
    provider, query, start_date, end_date, options = _info_from_request()
    content_count_over_time = provider.count_over_time(query, start_date, end_date, **options)
    # sum the total for display
    total_stories = 0
    if 'counts' in content_count_over_time:
        for c in content_count_over_time['counts']:
            total_stories += c['count']
    content_count_over_time['total_story_count'] = total_stories
    return jsonify({'results': content_count_over_time})


@app.route('/api/topics/<topics_id>/platforms/preview/words', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_top_words(topics_id):
    provider, query, start_date, end_date, options = _info_from_request()
    content_words = provider.words(query, start_date, end_date, **options)
    return jsonify({'results': content_words})


def _parse_query_dates():
    args = request.args
    if 'startDate' in args:
        start_date = date_util.solr_date_to_date(args['startDate'])
    elif 'start_date' in args:
        start_date = date_util.solr_date_to_date(args['start_date'])
    if 'endDate' in args:
        end_date = date_util.solr_date_to_date(args['endDate'])
    elif 'end_date' in args:
        end_date = date_util.solr_date_to_date(args['end_date'])
    return start_date, end_date


def parse_open_web_media_from_channel(channel):
    media = json.loads(channel)
    sources = media['sources[]'] if 'sources[]' in media and 'sources' not in [None, ''] else ''
    collections = media['collections[]'] if 'collections[]' in media else ''
    return sources, collections
