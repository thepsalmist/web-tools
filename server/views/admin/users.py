import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.cache import cache, key_generator
from server.util.request import form_fields_required
from server.auth import user_mediacloud_key, user_admin_mediacloud_client
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)

@cache.cache_on_arguments(function_key_generator=key_generator)
@app.route('/api/admin/users/list', methods=['GET'])
@api_error_handler
@flask_login.login_required
def api_system_user_search():
    mc = user_admin_mediacloud_client()
    search = request.args.get('searchStr') if 'searchStr' in request.args else None,
    link_id = request.args.get('linkId') if 'linkId' in request.args else None,
    page = mc.userList(search=search, link_id=link_id)
    return jsonify(page)

@app.route('/api/admin/users/<user_id>', methods=['GET'])
@api_error_handler
@flask_login.login_required
def api_system_user_by_id(user_id):
    mc = user_admin_mediacloud_client()
    # needed to put this behind an endpoint so browser doesn't cache it
    results = mc.userList(auth_users_id=user_id)
    return jsonify({"user": results['users'][0]})


@app.route('/api/admin/users/<user_id>/update', methods=['POST'])
@api_error_handler
@form_fields_required('full_name', 'email')
@flask_login.login_required
def api_system_user_update(user_id):
    mc = user_admin_mediacloud_client()

    # needed to put this behind an endpoint so browser doesn't cache it
    valid_params = {
        'email': request.form['email'],
        'full_name': request.form['full_name'],
        'notes': request.form['notes'] if 'notes' in request.form else None,  # this is optional
        'roles': request.form['roles[]'].split(',') if 'roles[]' in request.form else None,
        'active': bool(request.form['active'] == 'true') if 'active' in request.form else False,
        'max_topic_stories': request.form['max_topic_stories'] if 'max_topic_stories' in request.form else None,
        'weekly_requests_limit': request.form['weekly_requests_limit'] if 'weekly_requests_limit' in request.form else None,
    }
    results = mc.userUpdate(user_id, **valid_params)
    return jsonify(results)

@app.route('/api/admin/users/<user_id>/delete', methods=['GET'])
@api_error_handler
@flask_login.login_required
def api_system_user_delete(user_id):
    mc = user_admin_mediacloud_client()

    results = mc.userDelete(user_id)
    return jsonify(results)
