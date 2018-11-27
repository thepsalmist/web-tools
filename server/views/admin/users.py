import logging
from flask import jsonify, request
import flask_login

from server import app, mc
from server.cache import cache, key_generator
from server.auth import user_mediacloud_key, user_admin_mediacloud_client
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)

@cache.cache_on_arguments(function_key_generator=key_generator)
@app.route('/api/admin/users', methods=['GET'])
@api_error_handler
@flask_login.login_required
def api_system_users_list():
    mc = user_admin_mediacloud_client()
    all_users = []
    more_users = True
    link_id = 0

    while more_users:
        page = mc.userList(link_id=link_id)
        user_list = page['users']

        all_users = all_users + user_list
        if 'next' in page['link_ids']:
            link_id = page['link_ids']['next']
            more_users = True
        else:
            more_users = False

    return jsonify({"users": all_users})


@app.route('/api/admin/users/search/<search_str>', methods=['GET'])
@api_error_handler
@flask_login.login_required
def api_system_user_search(search_str):
    mc = user_admin_mediacloud_client()
    all_users = []
    more_users = True
    link_id = 0

    while more_users:
        page = mc.userList(search=search_str, link_id=link_id)
        user_list = page['users']

        all_users = all_users + user_list
        if 'next' in page['link_ids']:
            link_id = page['link_ids']['next']
            more_users = True
        else:
            more_users = False

    return jsonify({"users": all_users})


@app.route('/api/admin/users/<user_id>/update', methods=['GET'])
@api_error_handler
@flask_login.login_required
def api_system_user_update(user_id):
    mc = user_admin_mediacloud_client()
    # needed to put this behind an endpoint so browser doesn't cache it
    results = mc.userUpdate(user_id)
    return jsonify(results)
