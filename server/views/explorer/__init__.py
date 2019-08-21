import logging
from flask import request, jsonify, send_from_directory
import os
import datetime as dt
import flask_login
import json
import datetime
from slugify import slugify
import re

from server import mc, app, analytics_db
from server.auth import is_user_logged_in
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)

SORT_SOCIAL = 'social'
SORT_INLINK = 'inlink'
ALL_MEDIA = '-1'
DEFAULT_COLLECTION_IDS = [9139487]


def validated_sort(desired_sort, default_sort=SORT_SOCIAL):
    valid_sorts = [SORT_SOCIAL, SORT_INLINK]
    if (desired_sort is None) or (desired_sort not in valid_sorts):
        return default_sort
    return desired_sort


def topic_is_public(topics_id):
    topic = mc.topic(topics_id)
    is_public = topic['is_public']
    return int(is_public) == 1


def access_public_topic(topics_id):
    # check whether logged in here since it is a requirement for public access
    if (not is_user_logged_in()) and (topic_is_public(topics_id)):
        return True
    return False


# helper for preview queries
# tags_id is either a string or a list, which is handled in either case by the len() test. ALL_MEDIA is the exception
def concatenate_query_for_solr(solr_seed_query, media_ids, tags_ids, custom_ids):
    query = '({})'.format(solr_seed_query)

    if len(media_ids) > 0 or len(tags_ids) > 0 or len(custom_ids):
        if tags_ids == [ALL_MEDIA] or tags_ids == ALL_MEDIA:
            return query
        query += " AND ("
        # add in the media sources they specified
        if len(media_ids) > 0:
            media_ids = media_ids.split(',') if isinstance(media_ids, str) else media_ids
            query_media_ids = " ".join([str(m) for m in media_ids])
            query_media_ids = " media_id:({})".format(query_media_ids)
            query += '('+query_media_ids+')'

        # conjunction
        if len(media_ids) > 0 and ((len(tags_ids) > 0 or len(custom_ids) > 0)) :
            query += " OR "

        # add in the collections they specified
        if len(tags_ids) > 0:
            tags_ids = tags_ids.split(',') if isinstance(tags_ids, str) else tags_ids
            query_tags_ids = " ".join([str(t) for t in tags_ids])
            query_tags_ids = " tags_id_media:{}".format(query_tags_ids)
            if len(custom_ids) == 0:
                query += '('+query_tags_ids+')'
            else:
                query += '(' + query_tags_ids

        # grab any custom collections and turn it into a boolean tags_id_media phrase
        if len(custom_ids) > 0:
            custom_ids_dict = json.loads(custom_ids)
            query_custom_ids = ''
            for sets_of_tags in custom_ids_dict: #for each custom collections
                custom_tag_groups = json.loads(sets_of_tags['tags_id_media']) # expect tags in format [[x, ...], ...]
                custom_sets = []
                for tag_grp in custom_tag_groups:
                    if len(tag_grp) > 1: #handle singular [] vs groups of tags [x, y,z]
                        custom_id_set_string = " OR ".join(str(tag) for tag in tag_grp) # OR the ids within the same metadata set
                        custom_id_set_string = "tags_id_media:({})".format(custom_id_set_string)
                        custom_sets.append(custom_id_set_string)
                        custom_id_set_string = "tags_id_media:({})".format(custom_sets)
                    elif len(tag_grp) == 1:
                        custom_id_set_string = re.sub('\[*\]*', '', str(tag_grp))
                        custom_id_set_string = "tags_id_media:({})".format(custom_id_set_string)
                        custom_sets.append(custom_id_set_string)
                query_custom_ids = " AND ".join(custom_sets) # AND the metadata sets together
                query_custom_ids = "({})".format(query_custom_ids)
            if len(tags_ids) > 0:
                query = query + ' OR '+ query_custom_ids + ')' #  OR all the sets with the other Collection ids
            else:
                query += query_custom_ids  # add the sets to the query (the OR was added before)
        query += ')'

    return query


def dates_as_filter_query(start_date, end_date):
    date_query = ""
    if start_date:
        testa = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
        testb = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
        date_query = mc.publish_date_query(testa, testb, True, True)
    return date_query


def _default_query_dates():
    one_month_before_now = datetime.datetime.now() - datetime.timedelta(days=30)
    default_start_date = one_month_before_now
    default_end_date = datetime.datetime.now()
    return default_start_date, default_end_date


def parse_query_dates(args):
    default_start_date, default_end_date = _default_query_dates()
    if 'startDate' in args:
        start_date = dt.datetime.strptime(args['startDate'], "%Y-%m-%d")
    elif 'start_date' in args:
        start_date = dt.datetime.strptime(args['start_date'], "%Y-%m-%d")
    else:
        start_date = default_start_date
    if 'endDate' in args:
        end_date = dt.datetime.strptime(args['endDate'], "%Y-%m-%d")
    elif 'end_date' in args:
        end_date = dt.datetime.strptime(args['end_date'], "%Y-%m-%d")
    else:
        end_date = default_end_date
    return start_date, end_date


def _parse_media_ids(args):
    media_ids = []
    if 'sources' in args:
        if isinstance(args['sources'], str):
            media_ids = args['sources'].split(',') if 'sources' in args and len(args['sources']) > 0 else []
        else:
            media_ids = args['sources']
    return media_ids


def _parse_collection_ids(args):
    if 'collections' in args:
        if isinstance(args['collections'], str):
            if len(args['collections']) == 0:
                tags_ids = []
            else:
                tags_ids = args['collections'].split(',')  # make a list
        else:
            tags_ids = args['collections']
    else:
        tags_ids = DEFAULT_COLLECTION_IDS
    return tags_ids


REDDIT_SOURCE = 1254159  # a placeholder source to mark searching Reddit's biggest news-related subs


def only_queries_reddit(args):
    if isinstance(args, list):
        return (len(args) == 1) and (int(args[0]) == REDDIT_SOURCE)
    media_ids = _parse_media_ids(args)
    collection_ids = _parse_collection_ids(args)
    return (len(collection_ids) == 0) and (len(media_ids) == 1) and (int(media_ids[0]) == REDDIT_SOURCE)


def parse_query_with_keywords(args):
    solr_q = ''
    solr_fq = None
    # should I break this out into just a demo routine where we add in the start/end date without relying that the
    # try statement will fail?
    try:    # if user arguments are present and allowed by the client endpoint, use them, otherwise use defaults
        current_query = args['q']
        if current_query == '':
            current_query = "*"
        start_date, end_date = parse_query_dates(args)
        media_ids = _parse_media_ids(args)
        collections = _parse_collection_ids(args)
        solr_q = concatenate_query_for_solr(solr_seed_query=current_query,
                                            media_ids=media_ids,
                                            tags_ids=collections,
                                            custom_ids=args['searches'])
        solr_fq = dates_as_filter_query(start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d"))
    # otherwise, default
    except Exception as e:
        logger.warning("user custom query failed, there's a problem with the arguments " + str(e))
    return solr_q, solr_fq


def _parse_query_for_sample_search(sample_search_id, query_id):
    these_sample_searches = load_sample_searches()
    current_query_info = these_sample_searches[int(sample_search_id)]['queries'][int(query_id)]
    solr_q = concatenate_query_for_solr(solr_seed_query=current_query_info['q'],
                                        media_ids=current_query_info['sources'],
                                        tags_ids=current_query_info['collections'])
    solr_fq = dates_as_filter_query(current_query_info['startDate'], current_query_info['endDate'])
    return solr_q, solr_fq


def parse_as_sample(search_id_or_query, query_id=None):
    try:
        if isinstance(search_id_or_query, int):  # special handling for an indexed query
            sample_search_id = search_id_or_query
            return _parse_query_for_sample_search(sample_search_id, query_id)

    except Exception as e:
        logger.warning("error " + str(e))


sample_searches = None  # use as singeton, not cache so that we can change the file and restart and see changes


def load_sample_searches():
    global sample_searches
    if sample_searches is None:
        json_file = os.path.join(os.path.dirname(__file__), '../..', 'static/data/sample_searches.json')
        # load the sample searches file
        with open(json_file) as json_data:
            d = json.load(json_data)
            sample_searches = d
    return sample_searches


def read_sample_searches():
    json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..', 'static/data'))

    # load the sample searches file
    return send_from_directory(json_dir, 'sample_searches.json', as_attachment=True)


def file_name_for_download(label, type_of_download):
    length_limited_label = label
    if len(label) > 30:
        length_limited_label = label[:30]
    return '{}-{}'.format(slugify(length_limited_label), type_of_download)


@app.route('/api/explorer/count-stats', methods=['GET'])
@flask_login.login_required
@api_error_handler
def count_stats():
    # count the uses of sources or collection whenever the user clicks the search button
    sources = request.args['sources'].split(",") if 'sources' in request.args else None
    collections = request.args['collections'].split(",") if 'collections' in request.args else None
    for media_id in sources:
        analytics_db.increment_count(analytics_db.TYPE_MEDIA, media_id,
                                     analytics_db.ACTION_EXPLORER_QUERY, sources.count(media_id))
    for collection_id in collections:
        analytics_db.increment_count(analytics_db.TYPE_COLLECTION, collection_id,
                                     analytics_db.ACTION_EXPLORER_QUERY, collections.count(collection_id))
    return jsonify({'status': 'ok'})
