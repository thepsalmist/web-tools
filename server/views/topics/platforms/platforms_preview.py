import logging
from flask import jsonify, request
import flask_login
import datetime as dt

from server import app
from server.auth import user_mediacloud_client, user_mediacloud_key
from server.util.request import api_error_handler
from server.util.pushshift import reddit_submission_normalized_and_split_story_count, reddit_top_submissions, NEWS_SUBREDDITS, twitter_search_tweets
from server.util.stringutil import ids_from_comma_separated_str
import server.views.topics.apicache as apicache
from server.views.media_picker import concatenate_query_for_solr, custom_collection_as_solr_query
from server.views.topics import concatenate_solr_dates

logger = logging.getLogger(__name__)

OPEN_WEB = 1

def _topic_query_from_request():
    # TODO - adjust for preview and channel
    # channel contains sources, collections and searches
    q = concatenate_query_for_solr(solr_seed_query=request.args['platform_query'],
                                   media_ids=ids_from_comma_separated_str(request.args['sources[]'])
                                   if 'sources[]' in request.form else None,
                                   tags_ids=ids_from_comma_separated_str(request.args['collections[]'])
                                   if 'collections[]' in request.form else None,
                                   custom_ids=request.form['searches[]'])
    fq = concatenate_solr_dates(start_date=request.form['start_date'],
                                end_date=request.form['end_date'])
    return q, fq

@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    user_mc = user_mediacloud_client()

    #will do something conditional depending on platform
    platform = request.args['current_platform_type']
    topic = user_mc.topic(topics_id)
    platform_query = request.args['platform_query']
    num_stories = request.args['limit'] if 'limit' in request.args else 100
    source = request.form['source'] if 'source' in request.form else None
    start_date, end_date = parse_query_dates(topic)
    filter='description:MIT'
    if platform == 'reddit':

        story_count_result = reddit_top_submissions(query=platform_query,
                                                   start_date=start_date, end_date=end_date,
                                                   subreddits=NEWS_SUBREDDITS)
    elif platform == 'web':
        # TODO _topic_query_from_request
        story_count_result = user_mc.storyList(solr_query=platform_query, sort=user_mc.SORT_RANDOM, rows=num_stories)
    elif platform == 'twitter':
        # if source == 'crimson'
        #elif source == pushshift/elasticsearch
        story_count_result = twitter_search_tweets(query=platform_query, filter=filter,
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
        subreddits = request.args['channel'] if 'channel' in request.args else NEWS_SUBREDDITS
        story_count_result = reddit_submission_normalized_and_split_story_count(query=platform_query,
                                                                               start_date = start_date, end_date=end_date,
                                                                               subreddits=subreddits)
    elif platform =='twitter':
        story_count_result = twitter_search_tweets(query=platform_query, filter=filter,
                                               start_date=start_date, end_date=end_date)
    # get inherited topic dates and send them along w
    else:
        media = request.args['channel'] if 'channel' in request.args else '*'
        # TODO prep solr_query with _topic_query_from_request
        story_count_result = user_mc.storyCount(solr_query=platform_query)
    return jsonify(story_count_result)


@app.route('/api/topics/<topics_id>/platforms/preview/split-story-count', methods=['GET'])
@api_error_handler
def api_topics_platform_preview_split_story_count(topics_id):
    user_mc = user_mediacloud_client()
    platform_query = request.args['platform_query']
    topic = user_mc.topic(topics_id)
    start_date, end_date = parse_query_dates(topic)
    #only for web platform
    media = request.args['channel'] if 'channel' in request.args else '*'

    # TODO prep solr_query with _topic_query_from_request
    solr_query, fq = _topic_query_from_request()
    results = user_mc.storyCount(solr_query=solr_query, solr_filter=fq, split=True)
    total_stories = 0
    for c in results['counts']:
        total_stories += c['count']
    results['total_story_count'] = total_stories

    return jsonify({'results': results})

@app.route('/api/topics/<topics_id>/platforms/preview/words', methods=['GET'])
@api_error_handler
def api_topics_platform_preview_top_words(topics_id):
    user_mc = user_mediacloud_client()
    platform_query = request.args['platform_query']
    topic = user_mc.topic(topics_id)

    start_date, end_date = parse_query_dates(topic)
    #only for the web platform
    media = request.args['channel'] if 'channel' in request.args else '*'

    # TODO prep solr_query with media, dates etc probably should push up into utils explorer._init. parse_query_with_keywords

    response = apicache.topic_word_counts(user_mediacloud_key(), topics_id, q=platform_query)[:100]
    return jsonify(response)