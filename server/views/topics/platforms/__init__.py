
from flask import jsonify, request
import json
from server.views.topics import concatenate_solr_dates, concatenate_query_for_solr

def _topic_query_from_request():
    # TODO - adjust for preview and channel
    media = json.loads(request.args['channel'])
    media = media['channel']
    sources = media['sources[]'] if 'sources[]' in media and not [None, ''] else ''
    collections = media['collections[]'] if 'collections[]' in media else ''
    #searches = media['searches[]'] if 'searches[]' in media else '' #TODO for platforms? I don't think so
    # channel contains sources, collections and searches
    q = concatenate_query_for_solr(solr_seed_query=request.args['platform_query'],
                                   media_ids=sources,
                                   tags_ids=collections)
    fq = concatenate_solr_dates(start_date=request.args['start_date'],
                                end_date=request.args['end_date'])
    return q, fq

