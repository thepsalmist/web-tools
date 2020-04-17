import logging
from flask import jsonify
import flask_login

from server import app
from server.views.topics.apicache import topic_tag_coverage, topic_tag_counts
from server.util.csv import stream_response
import server.util.tags as tags_util
from server.util.request import api_error_handler, arguments_required
from server.auth import user_mediacloud_key
from server.views.topics.entities import process_tags_for_coverage

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/nyt-tags/counts.csv', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_nyt_tag_counts_csv(topics_id):
    tags = _nyt_tag_counts(user_mediacloud_key(), topics_id)
    return stream_response(tags['entities'], ['tags_id', 'tag', 'label', 'count', 'pct'], "topic-{}-nyt-label-counts".format(topics_id))


@app.route('/api/topics/<topics_id>/nyt-tags/counts', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_nyt_tag_counts(topics_id):
    results = _nyt_tag_counts(user_mediacloud_key(), topics_id)
    return jsonify(results)


def _nyt_tag_counts(user_mc_key, topics_id):
    tag_counts = topic_tag_counts(user_mc_key, topics_id, tags_util.NYT_LABELS_TAG_SET_ID)
    # remove the old labels from my first pass at using Taxonomic classifiers
    descriptor_tag_counts = [t for t in tag_counts if "Top/" not in t['tag']]
    data = process_tags_for_coverage(topics_id, descriptor_tag_counts)
    return data
