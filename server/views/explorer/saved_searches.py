import logging
from flask import jsonify, request
import json
import flask_login

from server import app, user_db
from server.auth import user_name
from server.util.request import form_fields_required

logger = logging.getLogger(__name__)


@app.route('/api/explorer/save-searches', methods=['POST'])
@flask_login.login_required
@form_fields_required('queryName', 'timestamp')  # could include queryParams or queries object
def save_user_search():
    username = user_name()
    queries = json.loads(request.form['queries'])
    name = request.form['queryName']
    timestamp = request.form['timestamp']
    user_db.add_item_to_users_list(username, 'searches', {
        'queries': queries,
        'queryName': name,
        'timestamp': timestamp,
    })
    return jsonify({'savedQuery': request.form['queryName']})


@app.route('/api/explorer/load-user-searches', methods=['GET'])
@flask_login.login_required
def load_user_searches():
    username = user_name()
    search_list = user_db.get_users_lists(username, 'searches')
    return jsonify({'list': search_list})


@app.route('/api/explorer/delete-search', methods=['POST'])
@flask_login.login_required
@form_fields_required('queryName', 'timestamp')
def delete_user_search():
    username = user_name()
    result = user_db.remove_item_from_users_list(username, 'searches', {'timestamp': request.form['timestamp']})
    return jsonify({'success': result.raw_result})
