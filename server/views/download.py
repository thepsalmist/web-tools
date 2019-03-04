import logging
import flask
from flask import request

from server import app
from server.util.request import form_fields_required
from server.util.csv import filename_timestamp

logger = logging.getLogger(__name__)


@app.route('/api/download/svg', methods=['POST'])
@form_fields_required('svgText', 'filename')
def download_svg():
    svg_text = request.form['svgText']
    filename_prefix = request.form['filename']
    filename = '{}-{}.svg'.format(filename_prefix, filename_timestamp())
    headers = {
        "Content-Disposition": "attachment;filename=" + filename,
    }
    return flask.Response(svg_text,
                          mimetype='image/svg+xml', headers=headers)
