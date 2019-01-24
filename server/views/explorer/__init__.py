import logging
from server.cache import cache
import os
import json
from server import mc
from flask import send_from_directory
from server.auth import is_user_logged_in
import datetime
from slugify import slugify

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
#tags_id is either a string or a list, which is handled in either case by the len() test. ALL_MEDIA is the exception
def concatenate_query_for_solr(solr_seed_query, media_ids, tags_ids):
    query = '({})'.format(solr_seed_query)

    #if isinstance(tags_ids, basestring) or isinstance(tags_ids, list):
    if len(media_ids) > 0 or len(tags_ids) > 0:
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
        if len(media_ids) > 0 and len(tags_ids) > 0:
            query += " OR "

        # add in the collections they specified
        if len(tags_ids) == 0:
            tags_ids = []
        else:
            tags_ids = tags_ids.split(',') if isinstance(tags_ids, str) else tags_ids
            query_tags_ids = " ".join([str(t) for t in tags_ids])
            query_tags_ids = " tags_id_media:({})".format(query_tags_ids)
            query += '('+query_tags_ids+')'
        query += ')'

    return query


def concatenate_query_and_dates(start_date, end_date):
    date_query = ""
    if start_date:
        testa = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
        testb = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
        date_query = mc.publish_date_query(testa, testb, True, True)
    return date_query


def parse_query_with_keywords(args):
    solr_q = ''
    solr_fq = None
    # default dates
    one_month_before_now = datetime.datetime.now() - datetime.timedelta(days=30)
    default_start_date = one_month_before_now.strftime("%Y-%m-%d")
    default_end_date = datetime.datetime.now().strftime("%Y-%m-%d")
    # should I break this out into just a demo routine where we add in the start/end date without relying that the
    # try statement will fail?
    try:    # if user arguments are present and allowed by the client endpoint, use them, otherwise use defaults
        current_query = args['q']
        if (current_query == ''):
            current_query = "*"
        if 'startDate' in args:
            start_date = args['startDate']
        elif 'start_date' in args:
            start_date = args['start_date']
        else:
            start_date = default_start_date
        if 'endDate' in args:
            end_date = args['endDate']
        elif 'end_date' in args:
            end_date = args['end_date']
        else:
            end_date = default_end_date
        media_ids = []

        if 'sources' in args:
            if isinstance(args['sources'], str):
                media_ids = args['sources'].split(',') if 'sources' in args and len(args['sources']) > 0 else []
            else:
                media_ids = args['sources']

        if 'collections' in args:
            if isinstance(args['collections'], str):
                if len(args['collections']) == 0:
                    tags_ids = []
                else:
                    tags_ids = args['collections'].split(',') # make a list
            else:
                tags_ids = args['collections']
        else:
            tags_ids = DEFAULT_COLLECTION_IDS

        solr_q = concatenate_query_for_solr(solr_seed_query=current_query,
                                                media_ids=media_ids,
                                                tags_ids=tags_ids)
        solr_fq = concatenate_query_and_dates(start_date, end_date)


    # otherwise, default
    except Exception as e:
        # tags_ids = args['collections'] if 'collections' in args and len(args['collections']) > 0 else []
        logger.warn("user custom query failed, there's a problem with the arguments " + str(e))

    return solr_q, solr_fq


def _parse_query_for_sample_search(sample_search_id, query_id):
    sample_searches = load_sample_searches()
    current_query_info = sample_searches[int(sample_search_id)]['queries'][int(query_id)]
    solr_q = concatenate_query_for_solr(solr_seed_query=current_query_info['q'],
                                        media_ids=current_query_info['sources'],
                                        tags_ids=current_query_info['collections'])
    solr_fq = concatenate_query_and_dates(current_query_info['startDate'], current_query_info['endDate'])
    return solr_q, solr_fq


def parse_as_sample(search_id_or_query, query_id=None):
    try:
        if isinstance(search_id_or_query, int): # special handling for an indexed query
            sample_search_id = search_id_or_query
            return _parse_query_for_sample_search(sample_search_id, query_id)

    except Exception as e:
        logger.warn("error " + str(e))


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
