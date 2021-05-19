import logging
from flask import request, jsonify
import flask_login

from server import app
import server.util.csv as csv
from server.auth import user_admin_mediacloud_client, user_has_auth_role, ROLE_MEDIA_EDIT
from server.util.request import api_error_handler

logger = logging.getLogger(__name__)


@app.route('/api/sources/<media_id>/feeds', methods=['GET'])
@flask_login.login_required
@api_error_handler
def api_source_feed(media_id):
    feed_list = source_feed_list(media_id)
    feed_count = len(feed_list)

    # TODO: FOR DEMOING - REMOVE THIS WHEN SITEMAPS DATA IS INCORPORATED
    if user_has_auth_role(ROLE_MEDIA_EDIT) and feed_list:
        media_id = feed_list[0]['media_id']
        statuses = ['preview_success', 'preview_processing', 'preview_failed', 'ingest_success',
                    'ingest_abandoned']
        mock_feeds = [_create_sitemap_feed(media_id, feed_count + idx, status) for idx, status in
                      enumerate(statuses, start=1)]
        feed_list = feed_list + mock_feeds
        feed_count = len(feed_list)

    return jsonify({'results': feed_list, 'count': feed_count})


def _create_sitemap_feed(media_id, feeds_id, status):
    return {
        "active": True,
        "feeds_id": feeds_id,
        "media_id": media_id,
        "status": status,
        "status_details": "This is pure junk!",
        "created_time": "2021-05-11 18:03:49.054207-04:00",
        "last_attempted_download_time": "2021-05-18 18:03:49.054207-04:00",
        "last_new_story_time": "2021-05-01 02:25:33.624136-04:00",
        "last_successful_download_time": "2021-05-18 18:03:52.999904-04:00",
        "type": "sitemap",
        "url": "http://www.mediacloud.org/services/xml/rss/fake-sitemaps.xml",
    }


@app.route('/api/sources/<_media_id>/feeds/<feed_id>/single', methods=['GET'])
@flask_login.login_required
@api_error_handler
def feed_details(_media_id, feed_id):
    user_mc = user_admin_mediacloud_client()
    feed = user_mc.feed(feed_id)
    return jsonify({'feed': feed})


@app.route('/api/sources/<media_id>/feeds/feeds.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def source_feed_csv(media_id):
    return stream_feed_csv('feeds-Source-' + media_id, media_id)


@app.route('/api/sources/<media_id>/feeds/create', methods=['POST'])
@flask_login.login_required
@api_error_handler
def feed_create(media_id):
    user_mc = user_admin_mediacloud_client()
    name = request.form['name']
    url = request.form['url']
    feed_type = request.form['type'] if 'type' in request.form else None  # this is optional
    active = request.form['active'] if 'active' in request.form else None  # this is optional

    result = user_mc.feedCreate(media_id, name, url, feed_type, active)
    return jsonify(result)


@app.route('/api/sources/feeds/<feed_id>/recent-stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def feed_recent_stories(feed_id):
    user_mc = user_admin_mediacloud_client()
    # don't want to cache here, because we want this list to be of the most recent stories from this feed
    result = user_mc.storyList(feeds_id=feed_id, sort=user_mc.SORT_PUBLISH_DATE_DESC)
    return jsonify({'list': result})


@app.route('/api/sources/feeds/<feed_id>/update', methods=['POST'])
@flask_login.login_required
@api_error_handler
def feed_update(feed_id):
    user_mc = user_admin_mediacloud_client()
    name = request.form['name']
    url = request.form['url']
    feed_type = request.form['type'] if 'type' in request.form else None  # this is optional
    active = request.form['active'] if 'active' in request.form else None  # this is optional

    result = user_mc.feedUpdate(feeds_id=feed_id, name=name, url=url, feed_type=feed_type, active=active)
    return jsonify(result)


def source_feed_list(media_id):
    all_feeds = []
    more_feeds = True
    max_feed_id = 0
    while more_feeds:
        logger.debug("last_feeds_id %d", max_feed_id)
        feeds = source_feed_list_page(media_id, max_feed_id)
        max_feed_id = feeds[-1]['feeds_id'] if len(feeds) > 0 else 0
        more_feeds = (len(feeds) == 100) and (len(feeds) > 0)
        all_feeds = all_feeds + feeds
    return sorted(all_feeds, key=lambda t: t['name'])


def source_feed_list_page(media_id, max_feed_id):
    user_mc = user_admin_mediacloud_client()
    return user_mc.feedList(media_id=media_id, rows=100, last_feeds_id=max_feed_id)


def stream_feed_csv(filename, media_id):
    response = cached_feed(media_id)
    props = ['name', 'type', 'url']
    return csv.stream_response(response, props, filename)


def cached_feed(media_id):
    res = source_feed_list(media_id)
    return res


@app.route('/api/sources/<media_id>/sitemaps/discover', methods=['POST'])
@flask_login.login_required
@api_error_handler
def sitemap_preview_discover(_media_id):
    return jsonify({'feeds': [], 'status': 'Stub for sitemap discovery'})


@app.route('/api/sources/feeds/sitemaps/<feed_id>/preview/abandon', methods=['POST'])
@flask_login.login_required
@api_error_handler
def sitemap_preview_abandon(_feed_id):
    return jsonify({'feeds': [], 'status': 'Stub for sitemap preview abandon'})


@app.route('/api/sources/feeds/sitemaps/<feed_id>/preview/retry', methods=['POST'])
@flask_login.login_required
@api_error_handler
def sitemap_preview_retry(_feed_id):
    return jsonify({'feeds': [], 'status': 'Stub for sitemap preview retry'})


@app.route('/api/sources/feeds/sitemaps/<feed_id>/preview/cancel', methods=['POST'])
@flask_login.login_required
@api_error_handler
def sitemap_preview_cancel(_feed_id):
    return jsonify({'feeds': [], 'status': 'Stub for sitemap preview cancel'})


@app.route('/api/sources/feeds/sitemaps/<feed_id>/preview/approve', methods=['POST'])
@flask_login.login_required
@api_error_handler
def sitemap_preview_approve(_feed_id):
    return jsonify({'feeds': [], 'status': 'Stub for sitemap preview approve'})


@app.route('/api/sources/feeds/sitemaps/<feed_id>/preview/reject', methods=['POST'])
@flask_login.login_required
@api_error_handler
def sitemap_preview_reject(_feed_id):
    reason = request.form['reason']
    return jsonify({'feeds': [], 'status': 'Reason for rejecting: "{reason}"'.format(reason=reason)})


@app.route('/api/sources/feeds/sitemaps/<feed_id>/preview/download', methods=['GET'])
@flask_login.login_required
@api_error_handler
def sitemap_preview_download(_feed_id):
    return jsonify({'feeds': [], 'status': 'Stub for sitemap preview download'})
