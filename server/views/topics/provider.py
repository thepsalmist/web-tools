import logging
from flask import jsonify
import flask_login
from typing import List, Dict
from operator import itemgetter

from server import app
from server.views import WORD_COUNT_SAMPLE_SIZE, WORD_COUNT_UI_NUM_WORDS
import server.util.csv as csv
from server.util.request import api_error_handler, safely_read_arg
from server.auth import user_mediacloud_key, user_mediacloud_client
from server.views.topics.stories import stream_story_list_csv
import server.views.topics.apicache as apicache
from server.util.stringutil import camel_to_snake, trim_solr_date


logger = logging.getLogger(__name__)


def _parse_optional_args(arg_names: List, custom_defaults: Dict = {}) -> Dict:
    parsed_args = {}
    for js_name in arg_names:
        python_name = camel_to_snake(js_name)
        # important to preserve None values here, rather than simple not adding the key,
        # because the None might be here to override a default value in the API call
        default = None if js_name not in custom_defaults.keys() else custom_defaults[js_name]
        parsed_args[python_name] = safely_read_arg(js_name, default)
    return parsed_args


def _parse_words_optional_arguments():
    """
    The user can override some of the defaults that govern any request for word lists within the topic. This method
    centralizes the parsing of those optional overrides from the request made.
    :return: a dict that can be spread as arguments to a call to topic_ngram_counts
    """
    return _parse_optional_args(['sample_size', 'ngramSize'],
                                {'sample_size': WORD_COUNT_SAMPLE_SIZE, 'ngramSize': 1})


@app.route('/api/topics/<topics_id>/provider/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_words(topics_id):
    optional_args = _parse_words_optional_arguments()
    word_counts = apicache.topic_ngram_counts(user_mediacloud_key(), topics_id, **optional_args)
    results = {
        'words': word_counts[:WORD_COUNT_UI_NUM_WORDS],
        **optional_args
    }
    return jsonify(results)


@app.route('/api/topics/<topics_id>/provider/words.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_words_csv(topics_id):
    optional_args = _parse_words_optional_arguments()
    results = apicache.topic_ngram_counts(user_mediacloud_key(), topics_id, **optional_args)
    file_name = 'topic-{}-sampled-ngrams-{}-word'.format(topics_id, optional_args['ngram_size'])
    return csv.stream_response(results, apicache.WORD_COUNT_DOWNLOAD_COLUMNS, file_name)


def _parse_stories_optional_arguments():
    """
    The user can override some of the defaults that govern any request for a story list within the topic. This method
    centralizes the parsing of those optional overrides from the request made.
    :return: a dict that can be spread as arguments to a call to topic_story_list
    """
    return _parse_optional_args(
        # these ones are supported by the low-level call to `topicsStoryList`
        apicache.TOPIC_STORY_LIST_API_PARAMS +
        # these ones are options to the story CSV download helper
        ['storyLimit', 'storyTags', 'mediaMetadata', 'platformUrlShares', 'socialShares']
    )


@app.route('/api/topics/<topics_id>/provider/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_stories(topics_id):
    optional_args = _parse_stories_optional_arguments()
    results = apicache.topic_story_list(user_mediacloud_key(), topics_id, **optional_args)
    return jsonify(results)


@app.route('/api/topics/<topics_id>/provider/stories.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_stories_csv(topics_id):
    optional_args = _parse_stories_optional_arguments()
    user_mc = user_mediacloud_client()
    topic = user_mc.topic(topics_id)
    del optional_args['link_id']  # we do this do make sure this helper can page through the results
    return stream_story_list_csv(user_mediacloud_key(), 'stories', topic, **optional_args)


def _parse_count_over_time_optional_arguments():
    """
    The user can override some of the defaults that govern any request for a count over time within the topic. This
    method centralizes the parsing of those optional overrides from the request made.
    :return: a dict that can be spread as arguments to a call to topic_split_story_counts
    """
    return _parse_optional_args(
        # these ones are supported by the low-level call
        ['snapshots_id', 'timespans_id', 'foci_id', 'q']
    )


@app.route('/api/topics/<topics_id>/provider/count-over-time', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_count_over_time(topics_id):
    optional_args = _parse_count_over_time_optional_arguments()
    results = apicache.topic_split_story_counts(user_mediacloud_key(), topics_id, **optional_args)
    return jsonify(results)


@app.route('/api/topics/<topics_id>/provider/count-over-time.csv', methods=['GET'])
@flask_login.login_required
def topic_provider_count_over_time_csv(topics_id):
    optional_args = _parse_count_over_time_optional_arguments()
    results = apicache.topic_split_story_counts(user_mediacloud_key(), topics_id, **optional_args)
    return _stream_topic_split_story_counts_csv(results)


def _stream_topic_split_story_counts_csv(user_mc_key, filename, topics_id, **kwargs):
    results = apicache.topic_split_story_counts(user_mc_key, topics_id, **kwargs)
    clean_results = [{'date': trim_solr_date(item['date']), 'stories': item['count']} for item in results['counts']]
    sorted_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'stories']
    return csv.stream_response(sorted_results, props, filename)

