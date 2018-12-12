# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
import json

from server import app, mc
import server.util.csv as csv
from server.auth import is_user_logged_in, user_mediacloud_key, user_mediacloud_client
from server.cache import cache, key_generator
from server.util.request import api_error_handler
from server.util.geo import COUNTRY_GEONAMES_ID_TO_APLHA3, HIGHCHARTS_KEYS
import server.util.tags as tags
from server.views.explorer import parse_as_sample, parse_query_with_keywords, \
    load_sample_searches, file_name_for_download
import server.views.explorer.apicache as apicache

logger = logging.getLogger(__name__)


@app.route('/api/explorer/geo-tags/counts', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_geotag_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_q, solr_fq = parse_as_sample(search_id, request.args['index'])
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)
    data = apicache.top_tags_with_coverage(solr_q, solr_fq, tags.GEO_TAG_SET)
    data['results'] = _filter_for_countries(data['results'])
    return jsonify(data)


@app.route('/api/explorer/demo/geo-tags/counts', methods=['GET'])
@api_error_handler
def api_explorer_demo_geotag_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_q, solr_fq = parse_as_sample(search_id, request.args['index'])
    else:
        solr_q, solr_fq= parse_query_with_keywords(request.args)
    data = apicache.top_tags_with_coverage(solr_q, solr_fq, tags.GEO_TAG_SET)
    data['results'] = _filter_for_countries(data['results'])
    return jsonify(data)


def _filter_for_countries(top_geo_tags):
    # this tag set has country and state tags, so we have to filter out to get just the country ones to draw a heatmap
    # 1: parse out the geonames id from the tag (ie. "geonames_6252001" and verify it on the whitelist
    country_tags = [t for t in top_geo_tags if int(t['tag'].split('_')[1]) in COUNTRY_GEONAMES_ID_TO_APLHA3.keys()]
    # 2: now add in helpful data for mapping it
    for t in country_tags:
        geonames_id = int(t['tag'].split('_')[1])
        t['geonamesId'] = geonames_id    # TODO: move this to JS?
        t['alpha3'] = COUNTRY_GEONAMES_ID_TO_APLHA3[geonames_id]
        # TODO: What is this doin ghere? Bad coupling of front and back-end
        for hq in HIGHCHARTS_KEYS:
            if hq['properties']['iso-a3'] == t['alpha3']:
                t['iso-a2'] = hq['properties']['iso-a2']
                t['value'] = t['count']
    return country_tags


@app.route('/api/explorer/geography/geography.csv', methods=['POST'])
@api_error_handler
def explorer_geo_csv():
    filename = u'sampled-geographic-coverage'
    data = request.form
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        filename = file_name_for_download(query_object['label'], filename)
    data = apicache.top_tags_with_coverage(solr_q, solr_fq, tags.GEO_TAG_SET)
    props = ['tags_id', 'label', 'geonamesId', 'count', 'pct', 'alpha3', 'iso-a2']
    return csv.stream_response(data['results'], props, filename)


@app.route('/api/explorer/geography/topplaces.csv', methods=['POST'])
@api_error_handler
def explorer_top_places_csv():
    filename = u'top-places'
    data = request.form
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        filename = file_name_for_download(query_object['label'], filename)
    data = apicache.top_tags_with_coverage(solr_q, solr_fq, tags.GEO_TAG_SET)
    data['results'] = _filter_for_countries(data['results'])
    props = ['label', 'count', 'pct', 'alpha3', 'iso-a2', 'geonamesId', 'tags_id', 'tag']
    return csv.stream_response(data['results'], props, filename)