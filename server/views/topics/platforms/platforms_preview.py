import logging
from flask import jsonify, request
import flask_login
import json

from server import app
from server.auth import user_mediacloud_key
from server.util.request import api_error_handler, arguments_required
import server.util.dates as date_util
import server.util.pushshift.reddit as ps_reddit
import server.util.pushshift.twitter as ps_twitter
import server.views.apicache as base_apicache
from server.views.topics import concatenate_solr_dates, concatenate_query_for_solr
from server.views.topics.platforms import PLATFORM_OPEN_WEB, PLATFORM_TWITTER, PLATFORM_REDDIT, PLATFORM_SOURCE_PUSHSHIFT

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    platform = request.args['platform_type']
    platform_query = request.args['platform_query']
    platform_source = request.args['platform_source']
    start_date, end_date = _parse_query_dates()
    story_list = []
    if platform == PLATFORM_REDDIT:
        story_list = ps_reddit.top_submissions(query=platform_query,
                                               start_date=start_date, end_date=end_date,
                                               subreddits=_parse_channel_as_reddit_subs())
    elif platform == PLATFORM_TWITTER:
        if platform_source == PLATFORM_SOURCE_PUSHSHIFT:
            story_list = ps_twitter.matching_tweets(query=platform_query,
                                                    start_date=start_date, end_date=end_date)
    elif platform == PLATFORM_OPEN_WEB:
        solr_query, fq = _parse_channel_as_open_web()
        story_list = base_apicache.story_list(user_mediacloud_key(), solr_query, fq)

    return jsonify(story_list)


@app.route('/api/topics/<topics_id>/platforms/preview/story-count', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_total_content(topics_id):
    platform = request.args['platform_type']
    platform_query = request.args['platform_query']
    platform_source = request.args['platform_source']
    start_date, end_date = _parse_query_dates()
    story_count_result = {'count': None}
    if platform == PLATFORM_REDDIT:
        story_count_result = {'count': ps_reddit.submission_count(query=platform_query,
                                                                  start_date=start_date, end_date=end_date,
                                                                  subreddits=_parse_channel_as_reddit_subs())}
    elif platform == PLATFORM_TWITTER:
        if platform_source == PLATFORM_SOURCE_PUSHSHIFT:
            story_count_result = {'count': ps_twitter.tweet_count(query=platform_query, start_date=start_date,
                                                                  end_date=end_date)}
    elif platform == PLATFORM_OPEN_WEB:
        solr_query, fq = _parse_channel_as_open_web()
        story_count_result = base_apicache.story_count(user_mediacloud_key(), solr_query, fq)
    return jsonify(story_count_result)


@app.route('/api/topics/<topics_id>/platforms/preview/attention', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_split_story_count(topics_id):
    platform = request.args['platform_type']
    platform_query = request.args['platform_query']
    platform_source = request.args['platform_source']
    start_date, end_date = _parse_query_dates()
    results = {}
    if platform == PLATFORM_REDDIT:
        results = ps_reddit.submission_normalized_and_split_story_count(query=platform_query,
                                                                        start_date=start_date, end_date=end_date,
                                                                        subreddits=_parse_channel_as_reddit_subs())
    elif platform == PLATFORM_TWITTER:
        if platform_source == PLATFORM_SOURCE_PUSHSHIFT:
            results = ps_twitter.tweet_split_count(query=platform_query, start_date=start_date, end_date=end_date)
    elif platform == PLATFORM_OPEN_WEB:
        solr_query, fq = _parse_channel_as_open_web()
        results = base_apicache.story_count(user_mediacloud_key(), solr_query, fq, split=True)
    # sum the total for display
    total_stories = 0
    if 'counts' in results:
        for c in results['counts']:
            total_stories += c['count']
    results['total_story_count'] = total_stories
    return jsonify({'results': results})


@app.route('/api/topics/<topics_id>/platforms/preview/words', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_top_words(topics_id, **kwargs):
    platform = request.args['platform_type']
    # platform_query = request.args['platform_query']
    # platform_source = request.args['platform_source']
    # start_date, end_date = _parse_query_dates()
    results = []
    if platform == PLATFORM_OPEN_WEB:
        solr_query, fq = _parse_channel_as_open_web()
        results = base_apicache.word_count(user_mediacloud_key(), solr_query, fq)[:100]
    return jsonify({'results': results})


def _parse_channel_as_reddit_subs():
    """
    Parse the channel out of the request as a comma-separated list of subreddit names
    """
    platform_channel = request.args['platform_channel'] if 'platform_channel' in request.args else ''
    return json.loads(platform_channel)


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


def _parse_channel_as_open_web():
    """
    Parse the channel out of the request as sources and collections
    """
    sources, collections = parse_open_web_media_from_channel(request.args['platform_channel'])
    q = concatenate_query_for_solr(solr_seed_query=request.args['platform_query'],
                                   media_ids=sources,
                                   tags_ids=collections)
    fq = concatenate_solr_dates(start_date=request.args['start_date'],
                                end_date=request.args['end_date'])
    return q, fq
