import logging
from flask import jsonify, request
import flask_login
import json
import time

from server import app
from server.auth import user_mediacloud_key
from server.util.request import api_error_handler, arguments_required
import server.util.dates as date_util
import server.util.pushshift.reddit as ps_reddit
import server.util.pushshift.twitter as ps_twitter
import server.views.apicache as base_apicache
from server.views.topics import concatenate_solr_dates, concatenate_query_for_solr

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    platform = request.args['platform_type']
    platform_query = request.args['platform_query']
    start_date, end_date = _parse_query_dates()
    if platform == 'reddit':
        time.sleep(0.1)
        story_count_result = ps_reddit.top_submissions(query=platform_query,
                                                       start_date=start_date, end_date=end_date,
                                                       subreddits=_parse_channel_as_reddit_subs())
    elif platform == 'twitter':
        story_count_result = ps_twitter.matching_tweets(query=platform_query,
                                                        start_date=start_date, end_date=end_date)
    elif platform == 'web':
        solr_query, fq = _parse_channel_as_open_web()
        story_count_result = base_apicache.story_list(user_mediacloud_key(), solr_query, fq)

    return jsonify(story_count_result)


@app.route('/api/topics/<topics_id>/platforms/preview/story-count', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_total_content(topics_id):
    platform = request.args['platform_type']
    platform_query = request.args['platform_query']
    start_date, end_date = _parse_query_dates()
    if platform == 'reddit':
        time.sleep(0.2)
        story_count_result = ps_reddit.submission_count(query=platform_query,
                                                        start_date=start_date, end_date=end_date,
                                                        subreddits=_parse_channel_as_reddit_subs())
    elif platform =='twitter':
        story_count_result = ps_twitter.tweet_count(query=platform_query, start_date=start_date, end_date=end_date)
    elif platform == 'web':
        solr_query, fq = _parse_channel_as_open_web()
        story_count_result = base_apicache.story_count(user_mediacloud_key(), platform_query, fq)
    return jsonify(story_count_result)


@app.route('/api/topics/<topics_id>/platforms/preview/attention', methods=['GET'])
@arguments_required('platform_type', 'platform_query', 'platform_source', 'platform_channel', 'start_date', 'end_date')
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_split_story_count(topics_id):
    platform = request.args['platform_type']
    platform_query = request.args['platform_query']
    start_date, end_date = _parse_query_dates()
    results = {}
    if platform == 'reddit':
        time.sleep(0.3)
        results = ps_reddit.submission_normalized_and_split_story_count(query=platform_query,
                                                                        start_date=start_date, end_date=end_date,
                                                                        subreddits=_parse_channel_as_reddit_subs())
    elif platform == 'web':
        solr_query, fq = _parse_channel_as_open_web()
        results = base_apicache.story_count(user_mediacloud_key(), solr_query, fq, split=True)
    elif platform == 'twitter':
        results = ps_twitter.tweet_split_count(query=platform_query, start_date=start_date, end_date=end_date)
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
    # start_date, end_date = _parse_query_dates()
    results = []
    if platform == 'web':
        solr_query, fq = _parse_channel_as_open_web()
        results = base_apicache.word_count(user_mediacloud_key(), solr_query, fq)[:100]
    return jsonify({'results': results})


def _parse_channel_as_reddit_subs():
    """
    Parse the channel out of the request as a comma-separated list of subreddit names
    """
    return request.args['platform_channel'].split(',') if 'channel' in request.args else []


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


def _parse_channel_as_open_web():
    """
    Parse the channel out of the request as sources and collections
    """
    media = json.loads(request.args['platform_channel'])
    sources = media['sources[]'] if 'sources[]' in media and not [None, ''] else ''
    collections = media['collections[]'] if 'collections[]' in media else ''
    # searches = media['searches[]'] if 'searches[]' in media else '' #TODO for platforms? I don't think so
    # channel contains sources, collections and searches
    q = concatenate_query_for_solr(solr_seed_query=request.args['platform_query'],
                                   media_ids=sources,
                                   tags_ids=collections)
    fq = concatenate_solr_dates(start_date=request.args['start_date'],
                                end_date=request.args['end_date'])
    return q, fq

