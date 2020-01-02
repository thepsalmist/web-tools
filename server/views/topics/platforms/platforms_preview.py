import logging
from flask import jsonify, request
import flask_login
import datetime as dt
import json

from server import app
from server.auth import user_mediacloud_client, user_mediacloud_key
from server.util.request import api_error_handler
import server.util.pushshift.reddit as ps_reddit
import server.util.pushshift.twitter as ps_twitter
import server.views.topics.apicache as apicache
from server.views.topics.platforms import _topic_query_from_request


logger = logging.getLogger(__name__)

OPEN_WEB = 1


@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    user_mc = user_mediacloud_client()
    # will do something conditional depending on platform
    platform = request.args['current_platform_type']
    topic = user_mc.topic(topics_id)
    platform_query = request.args['platform_query']
    num_stories = request.args['limit'] if 'limit' in request.args else 100
    source = request.form['source'] if 'source' in request.form else None
    start_date, end_date = parse_query_dates(topic)
    filter='description:MIT'
    if platform == 'reddit':
        subreddits = request.args['channel'] if 'channel' in request.args else ps_reddit.NEWS_SUBREDDITS
        story_count_result = ps_reddit.top_submissions(query=platform_query,
                                                       start_date=start_date, end_date=end_date,
                                                       subreddits=subreddits)
    elif platform == 'web':
        solr_query, fq = _topic_query_from_request()
        # replicating create preview flow (not using apicache.topicStoryList b/c we haven't spidered the topic/platform version yet
        solr_query, fq = _topic_query_from_request()
        story_count_result = user_mc.storyList(solr_query=solr_query, solr_filter=fq)
    elif platform == 'twitter':
        channel = request.args['channel'] if 'channel' in request.args else None
        channel = json.loads(channel)
        # TODO format channel properly for twitter, I suppose we will call different calls here for elite/crimson, etc apis

        # if 'crimson_hexagon' in channel
        #elif source == pushshift/elasticsearch
        story_count_result = ps_twitter.matching_tweets(query=platform_query,
                                                        start_date=start_date, end_date=end_date)

    return jsonify(story_count_result)


def parse_query_dates(args):

    if 'startDate' in args:
        start_date = dt.datetime.strptime(args['startDate'], "%Y-%m-%d")
    elif 'start_date' in args:
        start_date = dt.datetime.strptime(args['start_date'], "%Y-%m-%d")

    if 'endDate' in args:
        end_date = dt.datetime.strptime(args['endDate'], "%Y-%m-%d")
    elif 'end_date' in args:
        end_date = dt.datetime.strptime(args['end_date'], "%Y-%m-%d")

    return start_date, end_date


@app.route('/api/topics/<topics_id>/platforms/preview/story-count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_count(topics_id):
    user_mc = user_mediacloud_client()
    platform = request.args['current_platform_type']
    platform_query = request.args['platform_query']
    topic = user_mc.topic(topics_id)

    start_date, end_date = parse_query_dates(topic)
    if platform == 'reddit':
        subreddits = request.args['channel'] if 'channel' in request.args else ps_reddit.NEWS_SUBREDDITS
        story_count_result = ps_reddit.submission_normalized_and_split_story_count(query=platform_query,
                                                                                   start_date=start_date,
                                                                                   end_date=end_date,
                                                                                   subreddits=subreddits)
    elif platform =='twitter':
        channel = request.args['channel'] if 'channel' in request.args else None
        channel = json.loads(channel)
        # TODO format channel properly for twitter

        story_count_result = ps_twitter.tweet_count(query=platform_query,
                                                    start_date=start_date, end_date=end_date)

    else: # web
        media = request.args['channel'] if 'channel' in request.args else '*'
        # prep solr_query with _topic_query_from_request
        solr_query, fq = _topic_query_from_request()
        story_count_result = user_mc.storyCount(solr_query=platform_query, solr_filter=fq)
    return jsonify(story_count_result)


# for web attention preview
@app.route('/api/topics/<topics_id>/platforms/preview/attention', methods=['GET'])
@api_error_handler
def api_topics_platform_preview_split_story_count(topics_id):
    user_mc = user_mediacloud_client()
    topic = user_mc.topic(topics_id)
    # prep solr_query with _topic_query_from_request
    solr_query, fq = _topic_query_from_request()
    results = user_mc.storyCount(solr_query=solr_query, solr_filter=fq, split=True)
    total_stories = 0
    for c in results['counts']:
        total_stories += c['count']
    results['total_story_count'] = total_stories

    return jsonify({'results': results})


#for web words (if applicable)
@app.route('/api/topics/<topics_id>/platforms/preview/words', methods=['GET'])
@api_error_handler
def api_topics_platform_preview_top_words(topics_id, **kwargs):
    user_mc = user_mediacloud_client()
    platform_query = request.args['platform_query']

    params = kwargs.copy()
    solr_query, fq = _topic_query_from_request()
    merged_args = {
        'q': solr_query
    }
    params.update(merged_args)
    # TODO doesn't appear to take solr_filter

    response = apicache.topic_word_counts(user_mediacloud_key(), topics_id, **params)[:100]
    return jsonify({'results': response})