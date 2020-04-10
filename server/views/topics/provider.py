import logging
from flask import request, jsonify
import flask_login

from server import app, TOOL_API_KEY, executor
from server.views import WORD_COUNT_DOWNLOAD_NUM_WORDS, WORD_COUNT_SAMPLE_SIZE, WORD_COUNT_DOWNLOAD_SAMPLE_SIZE, \
    WORD_COUNT_UI_NUM_WORDS
import server.util.csv as csv
from server.util.request import api_error_handler, arguments_required, filters_from_args, json_error_response
from server.auth import user_mediacloud_key, is_user_logged_in, user_mediacloud_client
from server.views.topics.attention import stream_topic_split_story_counts_csv
from server.views.topics.stories import stream_story_list_csv
import server.views.topics.apicache as apicache
from server.views.topics import access_public_topic

logger = logging.getLogger(__name__)


def _parse_words_optional_arguments():
    """
    The user can override some of the defaults that govern any request for word lists within the topic. This method
    centralizes the parsing of those optional overrides from the request made.
    :return: a dict that can be spread as arguments to a call to topic_ngram_counts
    """
    sample_size = request.args['sampleSize'] if 'sampleSize' in request.args else WORD_COUNT_SAMPLE_SIZE
    ngram_size = request.args['ngramSize'] if 'ngramSize' in request.args else 1  # default to regular word count
    return {'sample_size': sample_size, 'ngram_size': ngram_size}


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
    with_overall = request.args['withOverall'] if 'withOverall' in request.args else False
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


@app.route('/api/topics/<topics_id>/provider/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_provider_count(topics_id):
    filtered = apicache.topic_story_count(user_mediacloud_key(), topics_id)
    total = apicache.topic_story_count(user_mediacloud_key(), topics_id, timespans_id=None, snapshots_id=None, foci_id=None,
                                       q=None)
    return jsonify({'counts': {'count': filtered['count'], 'total': total['count']}})
