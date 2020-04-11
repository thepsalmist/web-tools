import logging
from flask import request, jsonify
import flask_login
from typing import List, Dict

from server import app, TOOL_API_KEY, executor
from server.views import WORD_COUNT_DOWNLOAD_NUM_WORDS, WORD_COUNT_SAMPLE_SIZE, WORD_COUNT_DOWNLOAD_SAMPLE_SIZE, \
    WORD_COUNT_UI_NUM_WORDS
import server.util.csv as csv
from server.util.request import api_error_handler, safely_read_arg, arguments_required, filters_from_args, json_error_response
from server.auth import user_mediacloud_key, is_user_logged_in, user_mediacloud_client
from server.views.topics.attention import stream_topic_split_story_counts_csv
from server.views.topics.stories import stream_story_list_csv
import server.views.topics.apicache as apicache
from server.views.topics import access_public_topic
from server.util.stringutil import camel_to_snake

logger = logging.getLogger(__name__)


def _parse_optional_args(arg_names: List, custom_defaults: Dict = {}) -> Dict:
    parsed_args = {}
    for js_name in arg_names:
        python_name = camel_to_snake(js_name)
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


def _find_overall_timespan(topics_id, snapshots_id):
    """
    This helper returns the "overall" timespan for this snapshot. Raises an Error if it can't find it
    :param topics_id:
    :param snapshots_id:
    :return:
    """
    snapshot_timespans = apicache.cached_topic_timespan_list(user_mediacloud_key(), topics_id,
                                                             snapshots_id=snapshots_id)
    overall = [t for t in snapshot_timespans if t['period'] == 'overall']
    if len(overall) is 0:
        raise RuntimeError('Missing overall timespan in snapshot {} (topic {})!'.format(snapshots_id, topics_id))
    return overall[0]


@app.route('/api/topics/<topics_id>/provider/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_words(topics_id):
    optional_args = _parse_words_optional_arguments()
    with_overall = safely_read_arg('withOverall', False)
    word_counts = apicache.topic_ngram_counts(user_mediacloud_key(), topics_id, **optional_args)
    results = {
        'list': word_counts[:WORD_COUNT_UI_NUM_WORDS],
        **optional_args
    }
    # add overall snapshot counts if requested; this is parsed separately from optional_args because it is not a
    # valid argument you can pass into topic_ngram_counts
    if with_overall:
        # support quickly comparing word counts within a timespan to the totals for the overall timespan
        snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
        overall_timespan = _find_overall_timespan(topics_id, snapshots_id)
        overall_word_counts = apicache.topic_word_counts(user_mediacloud_key(), topics_id, **optional_args, q=None,
                                                         timespans_id=overall_timespan['timespans_id'], foci_id=None)
        results['overall'] = overall_word_counts[:WORD_COUNT_UI_NUM_WORDS]
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
    return _parse_optional_args(['linkToMediaId', 'linkFromMediaId', 'linkToStoriesId', 'linkFromStoriesId',
                                 'linkId', 'sort', 'limit'])


@app.route('/api/topics/<topics_id>/provider/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_stories(topics_id):
    optional_args = _parse_stories_optional_arguments()
    results = apicache.topic_story_list(user_mediacloud_key(), topics_id, **optional_args)
    # to allow for multiple parallel calls to be made on one page, here we support prefixing the results
    # if you pass in a responsePrefix, `stories` in the response will be changed to `[thePrefix]Stories`
    story_list_prefix = safely_read_arg('responsePrefix', False)
    if story_list_prefix:
        results["{}Stories".format(story_list_prefix)] = results['stories']
        del results['stories']
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
