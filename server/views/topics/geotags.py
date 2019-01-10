import logging
from flask import jsonify
import flask_login

from server import app
from server.auth import user_mediacloud_key
from server.util.csv import stream_response
from server.util.request import api_error_handler, arguments_required
import server.util.tags as tag_util
from server.util.geo import COUNTRY_GEONAMES_ID_TO_APLHA3, HIGHCHARTS_KEYS
from server.views.topics.apicache import topic_tag_coverage, topic_tag_counts
from server.views.topics.entities import process_tags_for_coverage

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/geo-tags/coverage', methods=['GET'])
@api_error_handler
def topic_geo_tag_coverage(topics_id):
    coverage = topic_tag_coverage(topics_id, tag_util.processed_for_entities_tag_ids())   # this will respect filters
    if coverage is None:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})
    return jsonify(coverage)


@app.route('/api/topics/<topics_id>/geo-tags/counts.csv', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_geo_tag_counts_csv(topics_id):
    tags = _geo_tag_counts(user_mediacloud_key(), topics_id)
    data = process_tags_for_coverage(topics_id, tags)
    return stream_response(tags, ['tags_id', 'tag', 'label', 'count', 'pct'], "topic-{}-geo-tag-counts".format(topics_id))


@app.route('/api/topics/<topics_id>/geo-tags/counts', methods=['GET'])
@arguments_required("timespanId")
@flask_login.login_required
@api_error_handler
def topic_geo_tag_counts(topics_id):
    tags = _geo_tag_counts(user_mediacloud_key(), topics_id)
    data = process_tags_for_coverage(topics_id, tags)
    return jsonify(data)


def _geo_tag_counts(user_mc_key, topics_id):
    tag_counts = topic_tag_counts(user_mc_key, topics_id, tag_util.GEO_TAG_SET,
                                  tag_util.GEO_SAMPLE_SIZE)
    # filter for countries, add in highcharts metadata
    country_tag_counts = [r for r in tag_counts if
                          int(r['tag'].split('_')[1]) in list(COUNTRY_GEONAMES_ID_TO_APLHA3.keys())]
    for r in country_tag_counts:
        geonamesId = int(r['tag'].split('_')[1])
        if geonamesId not in list(COUNTRY_GEONAMES_ID_TO_APLHA3.keys()):  # only include countries
            continue
        r['geonamesId'] = geonamesId  # TODO: move this to JS?
        r['alpha3'] = COUNTRY_GEONAMES_ID_TO_APLHA3[geonamesId]
        r['count'] = r['count']
        for hq in HIGHCHARTS_KEYS:
            if hq['properties']['iso-a3'] == r['alpha3']:
                r['iso-a2'] = hq['properties']['iso-a2']
                r['value'] = r['count']
    return country_tag_counts
