import logging
from flask import jsonify, request
import flask_login
from server import app, db
from server.auth import user_name
from server.util.request import arguments_required

logger = logging.getLogger(__name__)


@app.route('/api/explorer/save-searches', methods=['GET'])
@flask_login.login_required
@arguments_required('queryName', 'timestamp', 'queryParams')
def save_user_search():
    username = user_name()
    db.add_item_to_users_list(username, 'searches', request.args)
    return jsonify({'savedQuery': request.args['queryName']})


@app.route('/api/explorer/load-user-searches', methods=['GET'])
@flask_login.login_required
def load_user_searches():
    username = user_name()
    search_list = db.get_users_lists(username, 'searches')
    return jsonify({'list': search_list})


@app.route('/api/explorer/delete-search', methods=['GET'])
@flask_login.login_required
@arguments_required('queryName', 'timestamp', 'queryParams')
def delete_user_search():
    username = user_name()
    result = db.remove_item_from_users_list(username, 'searches', {'timestamp': int(request.args['timestamp'])})
    return jsonify({'success': result.raw_result})
