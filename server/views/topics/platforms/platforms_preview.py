import logging
from flask import jsonify, request
import flask_login
import json

from server import app
from server.auth import user_mediacloud_client, user_mediacloud_key
from server.util.request import api_error_handler
import server.util.dates as date_util
import server.util.pushshift.reddit as ps_reddit
import server.util.pushshift.twitter as ps_twitter
import server.views.apicache as base_apicache
from server.views.topics.platforms import _topic_query_from_request


logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    platform = request.args['current_platform_type']
    platform_query = request.args['platform_query']
    start_date, end_date = _topic_dates(topics_id)
    if platform == 'reddit':
        story_count_result = ps_reddit.top_submissions(query=platform_query,
                                                       start_date=start_date, end_date=end_date,
                                                       subreddits=_parse_channel_as_reddit_subs())
    elif platform == 'twitter':
        channel = request.args['channel'] if 'channel' in request.args else None
        channel = json.loads(channel)
        # TODO format channel properly for twitter, I suppose we will call different calls here for elite/crimson, etc apis
        # if 'crimson_hexagon' in channel
        #elif source == pushshift/elasticsearch
        story_count_result = ps_twitter.matching_tweets(query=platform_query,
                                                        start_date=start_date, end_date=end_date)
    elif platform == 'web':
        solr_query, fq = _topic_query_from_request()
        story_count_result = base_apicache.story_list(user_mediacloud_key(), solr_query, fq)

    return jsonify(story_count_result)


@app.route('/api/topics/<topics_id>/platforms/preview/story-count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_count(topics_id):
    platform = request.args['current_platform_type']
    platform_query = request.args['platform_query']
    start_date, end_date = _topic_dates(topics_id)
    if platform == 'reddit':
        story_count_result = ps_reddit.submission_count(query=platform_query,
                                                        start_date=start_date, end_date=end_date,
                                                        subreddits=_parse_channel_as_reddit_subs())
    elif platform =='twitter':
        channel = request.args['channel'] if 'channel' in request.args else None
        channel = json.loads(channel)
        # TODO format channel properly for twitter
        story_count_result = ps_twitter.tweet_count(query=platform_query, start_date=start_date, end_date=end_date)
    elif platform == 'web':
        solr_query, fq = _topic_query_from_request()
        story_count_result = base_apicache.story_count(user_mediacloud_key(), platform_query, fq)
    return jsonify(story_count_result)


@app.route('/api/topics/<topics_id>/platforms/preview/attention', methods=['GET'])
@api_error_handler
def api_topics_platform_preview_split_story_count(topics_id):
    platform = request.args['current_platform_type']
    platform_query = request.args['platform_query']
    start_date, end_date = _topic_dates(topics_id)
    results = {}
    if platform == 'reddit':
        results = ps_reddit.submission_normalized_and_split_story_count(query=platform_query,
                                                                        start_date=start_date, end_date=end_date,
                                                                        subreddits=_parse_channel_as_reddit_subs())
    elif platform == 'web':
        solr_query, fq = _topic_query_from_request()
        results = base_apicache.story_count(user_mediacloud_key(), solr_query, fq, split=True)
    elif platform == 'twitter':
        channel = request.args['channel'] if 'channel' in request.args else None
        channel = json.loads(channel)
        # TODO format channel properly for twitter
        results = ps_twitter.tweet_split_count(query=platform_query, _date=start_date, end_date=end_date)
    # sum the total for display
    total_stories = 0
    if 'counts' in results:
        for c in results['counts']:
            total_stories += c['count']
    results['total_story_count'] = total_stories
    return jsonify({'results': results})


@app.route('/api/topics/<topics_id>/platforms/preview/words', methods=['GET'])
@api_error_handler
def api_topics_platform_preview_top_words(topics_id, **kwargs):
    platform = request.args['current_platform_type']
    # platform_query = request.args['platform_query']
    # start_date, end_date = _topic_dates(topics_id)
    results = {}
    if platform == 'web':
        solr_query, fq = _topic_query_from_request()
        results = base_apicache.word_count(user_mediacloud_key(), solr_query, fq)[:100]
    return jsonify({'results': results})


def _parse_channel_as_reddit_subs():
    """
    Parse the channel out of the request as a comma-separated list of subreddit names
    """
    return request.args['channel'].split(',') if 'channel' in request.args else []


def _topic_dates(topics_id):
    user_mc = user_mediacloud_client()
    topic = user_mc.topic(topics_id)
    return _parse_query_dates(topic)


def _parse_query_dates(args):
    if 'startDate' in args:
        start_date = date_util.solr_date_to_date(args['startDate'])
    elif 'start_date' in args:
        start_date = date_util.solr_date_to_date(args['start_date'])
    if 'endDate' in args:
        end_date = date_util.solr_date_to_date(args['endDate'])
    elif 'end_date' in args:
        end_date = date_util.solr_date_to_date(args['end_date'])
    return start_date, end_date
