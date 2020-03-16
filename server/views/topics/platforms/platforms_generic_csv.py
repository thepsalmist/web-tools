import logging
from flask import jsonify, request
import flask_login
import datetime as dt
from werkzeug.utils import secure_filename
import os

from server import app
from server.util.request import api_error_handler
from server.auth import user_mediacloud_client
from server.util.request import form_fields_required, json_error_response
import server.views.topics.apicache as apicache
from server.views.sources.collection import allowed_file
from server.views.topics.platforms.platforms_preview import parse_open_web_media_from_channel
from server.platforms import PLATFORM_OPEN_WEB, PLATFORM_SOURCE_MEDIA_CLOUD

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/platforms/generic-csv/upload', methods=['POST'])
@flask_login.login_required
def platform_generic_upload(topics_id):
    """

    :param topics_id:
    :return:
    """
    if 'file' not in request.files:
        return json_error_response('No file uploaded')
    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return json_error_response('No file found in uploads')
    if not(uploaded_file and allowed_file(uploaded_file.filename)):
        return json_error_response('Invalid file')
    filename = "{}-{}-{}".format(topics_id, dt.datetime.now().strftime("%Y%m%d%H%M%S"),
                                 secure_filename(uploaded_file.filename))
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    # have to save b/c otherwise we can't locate the file path (security restriction)... can delete afterwards
    uploaded_file.save(filepath)
    return jsonify({'status': 'Success', 'filename': filename})
