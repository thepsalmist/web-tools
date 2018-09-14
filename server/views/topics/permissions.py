# -*- coding: utf-8 -*-
import logging
from flask import jsonify, request
import flask_login
import json
from mediacloud.error import MCException

from server import app
from server.util.request import json_error_response, api_error_handler
from server.auth import user_admin_mediacloud_client

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/permissions/list', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_permissions_list(topics_id):
    user_mc = user_admin_mediacloud_client()
    results = user_mc.topicPermissionsList(topics_id)
    return jsonify(results)


@app.route('/api/topics/<topics_id>/permissions/update', methods=['PUT'])
@flask_login.login_required
@api_error_handler
def topic_update_permission(topics_id):
    user_mc = user_admin_mediacloud_client()
    new_permissions = json.loads(request.form["permissions"])
    current_permissions = user_mc.topicPermissionsList(topics_id)['permissions']
    # first remove any people that you need to
    new_emails = [p['email'] for p in new_permissions]
    current_emails = [p['email'] for p in current_permissions]
    for email in current_emails:
        if email not in new_emails:
            user_mc.topicPermissionsUpdate(topics_id, email, 'none')
    # now update the remaining permissions
    for permission in new_permissions:
        if permission['permission'] not in [u'read', u'write', u'admin', u'none']:
            return json_error_response('Invalid permission value')
        try:
            user_mc.topicPermissionsUpdate(topics_id, permission['email'], permission['permission'])
        except MCException as e:
            # show a nice error if they type the email wrong
            if 'Unknown email' in e.message:
                return jsonify({'success': 0, 'results': e.message})
    return jsonify({'success': 1, 'results': user_mc.topicPermissionsList(topics_id)})
