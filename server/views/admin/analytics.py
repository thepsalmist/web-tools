import logging
from flask import jsonify
import flask_login

from server import app, analytics_db
from server.cache import cache
from server.util.request import api_error_handler
import server.views.apicache as apicache

logger = logging.getLogger(__name__)


@cache.cache_on_arguments()
@app.route('/api/admin/analytics/top-<the_type>/<the_action>', methods=['GET'])
@api_error_handler
@flask_login.login_required
def api_admin_top_stats(the_type, the_action):
    raw_results = analytics_db.top(the_type, the_action)
    results = []
    for row in raw_results:
        if the_action in row:
            if the_type == analytics_db.TYPE_MEDIA:
                results.append({
                    'item': apicache.media(row['id']),
                    'type': analytics_db.TYPE_MEDIA,
                    'count': row[the_action]
                })
            elif the_type == analytics_db.TYPE_COLLECTION:
                results.append({
                    'item': apicache.collection(row['id']),
                    'type': analytics_db.TYPE_COLLECTION,
                    'count': row[the_action]
                })
    return jsonify({'list': results})
