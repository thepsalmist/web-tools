import logging
from flask import jsonify, request, Response
import flask_login

from server import app, TOOL_API_KEY
from server.auth import user_mediacloud_key, user_mediacloud_client, user_admin_mediacloud_client, is_user_logged_in
from server.util import csv
from server.views.topics import validated_sort, TOPIC_MEDIA_CSV_PROPS
import server.views.topics.apicache as apicache
import server.views.apicache as base_apicache
from server.util.request import filters_from_args, api_error_handler
from server.views.topics import access_public_topic


logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/media', methods=['GET'])
@api_error_handler
def topic_media(topics_id):
    if access_public_topic(topics_id):
        media_list = apicache.topic_media_list(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None,
                                               foci_id=None, sort=None, limit=None, link_id=None)
    elif is_user_logged_in():
        media_list = apicache.topic_media_list(user_mediacloud_key(), topics_id)
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})

    return jsonify(media_list)


@app.route('/api/topics/<topics_id>/media/<media_id>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media(topics_id, media_id):
    user_mc = user_admin_mediacloud_client()
    combined_media_info = apicache.topic_media_list(user_mediacloud_key(), topics_id, media_id=media_id)['media'][0]
    media_info = user_mc.media(media_id)
    for key in list(media_info.keys()):
        if key not in list(combined_media_info.keys()):
            combined_media_info[key] = media_info[key]
    return jsonify(combined_media_info)


@app.route('/api/topics/<topics_id>/media.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_media_csv(topics_id):
    sort = validated_sort(request.args.get('sort'))
    mc = user_mediacloud_client()
    topic = mc.topic(topics_id)
    timestamped_filename = csv.safe_filename(topic['name'] + '-' + 'media')
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    headers = {
        "Content-Disposition": "attachment;filename=" + timestamped_filename
    }
    return Response(_stream_media_by_page(user_mediacloud_key(), topics_id, TOPIC_MEDIA_CSV_PROPS,
                                          sort=sort, limit=1000, timespans_id=timespans_id, link_id=0),
                    mimetype='text/csv; charset=utf-8', headers=headers)


def _stream_media_by_page(user_mc_key, topics_id, props, **kwargs):
    yield ','.join(props) + '\n'  # first send the column names
    more_media = True
    while more_media:
        page = apicache.topic_media_list_page(user_mc_key, topics_id, **kwargs)
        media = page['media']
        for m in media:
            row = csv.dict2row(props, m)
            row_string = ','.join(row) + '\n'
            yield row_string
        if 'next' in page['link_ids']:
            kwargs['link_id'] = page['link_ids']['next']
            more_media = True
        else:
            more_media = False


@app.route('/api/topics/<topics_id>/media/media-links.csv', methods=['GET'])
@flask_login.login_required
def get_topic_media_links_csv(topics_id):
    user_mc = user_mediacloud_client()
    topic = user_mc.topic(topics_id)
    return stream_media_link_list_csv(user_mediacloud_key(), topic['name'] + '-media-links', topics_id)


def stream_media_link_list_csv(user_mc_key, filename, topics_id, **kwargs):
    params = kwargs.copy()
    merged_args = {
        'snapshots_id': request.args['snapshotId'],
        'timespans_id': request.args['timespanId'],
        'foci_id': request.args['focusId'] if 'foci_id' in request.args else None,
    }
    params.update(merged_args)
    if 'q' in params:
        params['q'] = params['q'] if 'q' not in [None, '', 'null', 'undefined'] else None
    params['limit'] = 1000  # an arbitrary value to let us page through with big topics

    timestamped_filename = csv.safe_filename(filename)
    headers = {
        "Content-Disposition": "attachment;filename=" + timestamped_filename
    }
    columns = ['src_media_id', 'src_media_name', 'src_media_url', 'ref_media_id', 'ref_media_name', 'ref_media_url']
    return Response(_topic_media_link_list_by_page_as_csv_row(user_mc_key, topics_id, columns, **params),
                    mimetype='text/csv; charset=utf-8', headers=headers)


def _media_info_worker(info):
    return base_apicache.get_media_with_key(info['key'], info['media_id'])


# generator you can use to handle a long list of stories row by row (one row per story)
def _topic_media_link_list_by_page_as_csv_row(user_mc_key, topics_id, props, **kwargs):
    yield ','.join(props) + '\n'  # first send the column names
    more_media = True
    link_id = 0
    basic_media_props = ['media_id', 'name', 'url']
    while more_media:
        # fetch one page of data
        media_link_page = apicache.topic_media_link_list_by_page(TOOL_API_KEY, topics_id, link_id, **kwargs)
        # get the media info for all the media sources
        media_src_ids = [str(s['source_media_id']) for s in media_link_page['links']]
        media_ref_ids = [str(s['ref_media_id']) for s in media_link_page['links']]
        media_src_ids = set(media_src_ids + media_ref_ids)  # make it distinct
        # TODO: PARALLELIZE - can't use executor here, because we are out of the context?
        media_lookup = {int(mid): _media_info_worker({'key': user_mc_key, 'media_id': mid})
                        for mid in media_src_ids}
        # connect the link data to the media info data
        for link_pair in media_link_page['links']:
            link_pair['source_info'] = media_lookup[int(link_pair['source_media_id'])]
            link_pair['ref_info'] = media_lookup[int(link_pair['ref_media_id'])]
        # stream this page's results to the client
        for s in media_link_page['links']:
            cleaned_source_info = csv.dict2row(basic_media_props, s['source_info'])
            cleaned_ref_info = csv.dict2row(basic_media_props, s['ref_info'])
            row_string = ','.join(cleaned_source_info) + ',' + ','.join(cleaned_ref_info) + '\n'
            yield row_string
        # set up to grab the next page
        if 'next' in media_link_page['link_ids']:
            link_id = media_link_page['link_ids']['next']
        else:
            more_media = False
