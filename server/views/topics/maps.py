import logging
import flask
from flask import jsonify, request, send_from_directory
import flask_login
import os
from multiprocessing import Process

from server import app
from server.auth import user_mediacloud_client
import server.views.topics.apicache as apicache
from server.util.request import arguments_required, filters_from_args, api_error_handler

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/map-files/list', methods=['GET'])
@arguments_required('timespanId')
@api_error_handler
def map_files_list(topics_id):
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    results = apicache.topic_media_map_list(topics_id, timespans_id)
    return jsonify(results)


@app.route('/api/topics/<topics_id>/map-files/<timespans_maps_id>', methods=['GET'])
@api_error_handler
def map_file(topics_id, timespans_maps_id):
    return apicache.topic_media_map(topics_id, timespans_maps_id)




@app.route('/api/topics/<topics_id>/map-files/<map_type>.<map_format>', methods=['GET'])
@arguments_required('timespanId')
@flask_login.login_required
def map_files_download(topics_id, map_type, map_format):
    logger.info(map_type+":"+map_format)
    if map_format == "json":
        mime_type = "application/json"
    elif map_format == "gexf":
        mime_type = "application/octet-stream"
    else:
        mime_type = "text/plain"
    filename = map_type+"-"+topics_id+"-"+request.args['timespanId']+"."+map_format
    return send_from_directory(directory=DATA_DIR, filename=filename, mimetype=mime_type, as_attachment=True)


@app.route('/api/topics/<topics_id>/map-files/fetchCustomMap', methods=['GET'])
@arguments_required('timespanId', 'color_field', 'num_media', 'include_weights')
# @flask_login.login_required
def map_files_download_custom(topics_id):
    user_mc = user_mediacloud_client()
    # how to treat these as req or default?
    optional_args = {
        'timespans_id': request.args['timespanId'] if 'timespanId' in request.args else None,
        'snapshots_id': request.args['snapshotId'] if 'snapshots_id' in request.args else None,
        'foci_id': request.args['fociId'] if 'foci_id' in request.args else None,
        'color_field': request.args['color_field'] if 'color_field' in request.args else 'media_type',
        'num_media': request.args['num_media'] if 'num_media' in request.args else 500,    # this is optional
        'include_weights': request.args['include_weights'] if 'include_weights' in request.args else 1,
        'num_links_per_medium': request.args['num_links_per_medium'] if 'num_links_per_medium' in request.args
                                                                        else None,
    }
    filename = "link-map-"+topics_id+"-"+request.args['timespanId']+"."+"gexf"
    result_stream = user_mc.topicMediaMap(topics_id, **optional_args)
    return flask.Response(result_stream, mimetype="attachment/octet-stream",
                          headers={"Content-Disposition": "attachment;filename="+filename})


def _start_generating_map_file(map_type, topics_id, timespans_id):
    file_prefix = _get_file_prefix(map_type, topics_id, timespans_id)
    file_path = os.path.join(DATA_DIR, file_prefix)
    p = Process(target=mapwriter.create_word_map_files, args=(topics_id, timespans_id, file_path))
    p.start()


def _get_file_prefix(map_type, topics_id, timespans_id):
    return map_type+"-"+str(topics_id)+"-"+str(timespans_id)
