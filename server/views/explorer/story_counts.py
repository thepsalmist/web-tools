import logging
from flask import jsonify, request
import flask_login
import json

from server import app, TOOL_API_KEY
from server.auth import user_mediacloud_key, is_user_logged_in
import server.util.csv as csv
from server.util.request import api_error_handler
from server.views.explorer import parse_as_sample,\
    parse_query_with_keywords, load_sample_searches, file_name_for_download, concatenate_query_for_solr,\
    DEFAULT_COLLECTION_IDS
import server.views.explorer.apicache as apicache

logger = logging.getLogger(__name__)


@app.route('/api/explorer/stories/count.csv', methods=['POST'])
def explorer_story_count_csv():
    filename = 'total-story-count'
    data = request.form
    if 'searchId' in data:
        # TODO: don't load this query twice because that is kind of dumb
        sample_searches = load_sample_searches()
        queries = sample_searches[data['searchId']]['queries']
    else:
        queries = json.loads(data['queries'])
    label = " ".join([q['label'] for q in queries])
    filename = file_name_for_download(label, filename)
    # now compute total attention for all results
    story_count_results = []
    for q in queries:
        solr_q, solr_fq = parse_query_with_keywords(q)
        solr_open_query = concatenate_query_for_solr(solr_seed_query='*', media_ids=q['sources'],
                                                     tags_ids=q['collections'])
        story_counts = apicache.normalized_and_story_count(solr_q, solr_fq, solr_open_query)
        story_count_results.append({
            'query': q['label'],
            'matching_stories': story_counts['total'],
            'total_stories': story_counts['normalized_total'],
            'ratio': float(story_counts['total']) / float(story_counts['normalized_total'])
        })
    props = ['query', 'matching_stories', 'total_stories', 'ratio']
    return csv.stream_response(story_count_results, props, filename)


@app.route('/api/explorer/stories/split-count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_explorer_story_split_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None
    index = int(request.args['index']) if 'index' in request.args else None

    #get specific stories by keyword
    if isinstance(search_id, int) and search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_q, solr_fq = parse_as_sample(search_id, request.args['index'])
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)

    # get all the stories (no keyword)
    solr_open_query = concatenate_query_for_solr(solr_seed_query='*',
                                                 media_ids=request.args['sources'],
                                                 tags_ids=request.args['collections'])
    results = apicache.normalized_and_story_split_count(solr_q, solr_fq, solr_open_query)

    return jsonify({'results': results})


@app.route('/api/explorer/demo/stories/split-count', methods=['GET'])
# handles search id query or keyword query
@api_error_handler
def api_explorer_demo_story_split_count():
    search_id = int(request.args['search_id']) if 'search_id' in request.args else None

    if isinstance(search_id, int) and search_id not in [None, -1]:
        SAMPLE_SEARCHES = load_sample_searches()
        current_search = SAMPLE_SEARCHES[search_id]['queries']
        solr_q, solr_fq = parse_as_sample(search_id, request.args['index'])
    else:
        solr_q, solr_fq = parse_query_with_keywords(request.args)
    # why is this call fundamentally different than the cache call???
    solr_open_query = concatenate_query_for_solr(solr_seed_query='*',
                                                 media_ids=[],
                                                 tags_ids=DEFAULT_COLLECTION_IDS)
    results = apicache.normalized_and_story_split_count(solr_q, solr_fq, solr_open_query)

    return jsonify({'results': results})


@app.route('/api/explorer/stories/split-count-all.csv', methods=['POST'])
@api_error_handler
def api_explorer_story_split_count_csv():
    filename = 'stories-over-time'
    data = request.form
    if 'searchId' in data:
        solr_q, solr_fq = parse_as_sample(data['searchId'], data['index'])
        filename = filename  # don't have this info + current_query['q']
        SAMPLE_SEARCHES = load_sample_searches()
        queries = SAMPLE_SEARCHES[data['searchId']]['queries']
    else:
        queries = json.loads(data['queries'])
    label = " ".join([q['label'] for q in queries])
    filename = file_name_for_download(label, filename)
    # now compute total attention for all results
    story_count_results = []
    for q in queries:
        solr_q, solr_fq = parse_query_with_keywords(q)
        solr_open_query = concatenate_query_for_solr(solr_seed_query='*', media_ids=q['sources'],
                                                     tags_ids=q['collections'])
        story_counts = apicache.normalized_and_story_count(solr_q, solr_fq, solr_open_query)
        story_count_results.append({
            'date': q['startDate'],
            'query': q['label'],
            'matching_stories': story_counts['total'],
            'total_stories': story_counts['normalized_total'],
            'ratio': float(story_counts['total']) / float(story_counts['normalized_total'])
        })
    props = ['date','query', 'matching_stories', 'total_stories', 'ratio']
    return csv.stream_response(story_count_results, props, filename)
