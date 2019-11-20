import logging
from flask import jsonify, request
import flask_login
import datetime as dt

from server import app
from server.util.request import api_error_handler, form_fields_required
from server.auth import user_mediacloud_client, user_mediacloud_key
from server.util.pushshift import reddit_submission_normalized_and_split_story_count, reddit_top_submissions, NEWS_SUBREDDITS

logger = logging.getLogger(__name__)

OPEN_WEB = 1

@app.route('/api/topics/<topics_id>/platforms/preview/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_topics_platform_preview_story_sample(topics_id):
    user_mc = user_mediacloud_client()

    #will do something conditional depending on platform
    platform = request.args['current_platform_type']
    topic = user_mc.topic(topics_id)
    platform_query = request.args['platform_query']
    num_stories = request.args['limit']
    source = request.form['source'] if 'source' in request.form else None

    if platform == 'reddit':
        start_date, end_date = parse_query_dates(topic)
        story_count_result = reddit_top_submissions(query=platform_query,
                                                   start_date=start_date, end_date=end_date,
                                                   subreddits=NEWS_SUBREDDITS)
    elif platform == 'web':
        story_count_result = user_mc.storyList(solr_query=platform_query, sort=user_mc.SORT_RANDOM, rows=num_stories)
    elif platform == 'twitter':
        # depending on source, pull out of pushshift
        # if source == 'crimson'
        story_count_result = user_mc.storyList(solr_query=platform_query, sort=user_mc.SORT_RANDOM, rows=num_stories)

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
    #will do something conditional depending on platform
    platform = request.args['current_platform_type']
    platform_query = request.args['platform_query']
    topic = user_mc.topic(topics_id)

    if platform == 'reddit':
        subreddits = request.args['sub_query'] if 'sub_query' in request.args else NEWS_SUBREDDITS
        start_date, end_date = parse_query_dates(topic)
        story_count_result = reddit_submission_normalized_and_split_story_count(query=platform_query,
                                                                               start_date = start_date, end_date=end_date,
                                                                               subreddits=subreddits)

    # get inherited topic dates and send them along w
    else:
        story_count_result = user_mc.storyCount(solr_query=platform_query)
    return jsonify(story_count_result)