import logging
from flask import jsonify, request
import flask_login
import json

from server import app
import server.util.csv as csv
from server.util.request import api_error_handler
import server.util.tags as tags
from server.views.explorer import parse_as_sample, parse_query_with_keywords, file_name_for_download
import server.views.explorer.apicache as apicache

logger = logging.getLogger(__name__)


@app.route('/api/explorer/geo-tags/counts', methods=['POST'])
@flask_login.login_required
@api_error_handler
def api_explorer_geotag_count():
    search_id = int(request.form['search_id']) if 'search_id' in request.form else None
    if search_id not in [None, -1]:
        solr_q, solr_fq = parse_as_sample(search_id, request.form['index'])
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.form)
    data = apicache.top_tags_with_coverage(solr_q, solr_fq, tags.GEO_TAG_SET)
    return jsonify(data)


@app.route('/api/explorer/demo/geo-tags/counts', methods=['GET'])
@api_error_handler
def api_explorer_demo_geotag_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    if search_id not in [None, -1]:
        solr_q, solr_fq = parse_as_sample(search_id, request.args['index'])
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)
    data = apicache.top_tags_with_coverage(solr_q, solr_fq, tags.GEO_TAG_SET)
    return jsonify(data)


@app.route('/api/explorer/geography/geography.csv', methods=['POST'])
@api_error_handler
def explorer_geo_csv():
    filename = 'sampled-geographic-coverage'
    data = request.form
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
    else:
        query_object = json.loads(data['q'])
        solr_q, solr_fq = parse_query_with_keywords(query_object)
        filename = file_name_for_download(query_object['label'], filename)
    data = apicache.top_tags_with_coverage(solr_q, solr_fq, tags.GEO_TAG_SET)
    props = ['tags_id', 'label', 'count', 'pct']
    return csv.stream_response(data['results'], props, filename)
