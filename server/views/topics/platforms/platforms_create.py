import logging
from flask import jsonify, request
import flask_login
from server import app
from server.util.request import api_error_handler
from server.auth import user_mediacloud_client
from server.util.request import form_fields_required
from server.views.topics.platforms.platforms_preview import parse_open_web_media_from_channel
from server.views.topics.platforms import PLATFORM_OPEN_WEB, PLATFORM_TWITTER, PLATFORM_REDDIT, PLATFORM_FACEBOOK,\
    PUSHSHIFT_SOURCE, CRIMSON_HEXAGON_SOURCE, CROWD_TANGLE_SOURCE

logger = logging.getLogger(__name__)

WEB_SEED_QUERY_PLACEHOLDER_ID = -1
WEB_SEED_QUERY_PLACEHOLDER = {'platform': PLATFORM_OPEN_WEB, 'source': 'web_ui_shim', 'query': '', 'topic_seed_queries_id': -1}


@app.route('/api/topics/<topics_id>/platforms/list', methods=['GET'])
@flask_login.login_required
def get_topic_platforms(topics_id):
    user_mc = user_mediacloud_client()
    available_platforms = [
        {'platform': PLATFORM_REDDIT, 'source': PUSHSHIFT_SOURCE, 'query': '', 'topic_seed_queries_id': -1},
        {'platform': PLATFORM_TWITTER, 'source': PUSHSHIFT_SOURCE, 'query': '', 'topic_seed_queries_id': -1},
        {'platform': PLATFORM_TWITTER, 'source': CRIMSON_HEXAGON_SOURCE, 'query': '', 'topic_seed_queries_id': -1},
        {'platform': PLATFORM_FACEBOOK, 'source': CROWD_TANGLE_SOURCE, 'query': '', 'topic_seed_queries_id': -1},
    ]
    topic = user_mc.topic(topics_id)
    # and add in the open web query, which isn't stored in topic_seed_queries for historical reasons :-(
    if topic['solr_seed_query'] not in [None, '']:
        web_seed_query = {'platform': PLATFORM_OPEN_WEB, 'source': 'web_ui_shim',
                          'query': topic['solr_seed_query'],
                          'media': topic['media_tags'],
                          'topic_seed_queries_id': 1}
    else:
        web_seed_query = WEB_SEED_QUERY_PLACEHOLDER
    available_platforms.insert(0, web_seed_query)  # important to have this one at start of list
    # now fill in with any seed queries that have been created
    for seed_query in topic['topic_seed_queries']:
        match = [p for p in available_platforms if (p['platform'] == seed_query['platform'])
                 and (p['source'] == seed_query['source'])]
        if len(match) == 1:
            match[0]['query'] = seed_query['query']
            match[0]['topic_seed_queries_id'] = seed_query['topic_seed_queries_id']
    return jsonify({'results': available_platforms})


@app.route('/api/topics/<topics_id>/platforms/add', methods=['POST'])
@flask_login.login_required
@form_fields_required('platform_type', 'platform_query', 'platform_source', 'platform_channel')
@api_error_handler
def topic_add_platform(topics_id):
    user_mc = user_mediacloud_client()
    channel = request.form['platform_channel'] if 'platform_channel' in request.form else None
    source = request.form['platform_source'] if 'platform_source' in request.form else None
    query = request.form['platform_query'] if 'platform_query' in request.form else None
    platform = request.form['platform_type']
    result = {}
    if platform == PLATFORM_OPEN_WEB:
        # channel has open web sources in it
        sources, collections = parse_open_web_media_from_channel(channel)
        user_mc.topicUpdate(topics_id, media_ids=sources, media_tags_ids=collections, solr_seed_query=query)
        result['success'] = 1
        result['id'] = 1 #web_shim_ui
    else:
        # TODO do we need to add dates?
        # TODO format channel properly for reddit (subreddit)
        #if twitter crimson_hexagon, id is in query field
        result = user_mc.topicAddSeedQuery(topics_id=topics_id, platform=platform, source=source, query=query)
        result['success'] = 1 if 'topic_seed_query' in result else 0
        result['id'] = result['topic_seed_query']['topic_seed_queries_id']
    return jsonify(result) #topic_seed_queries_id


@app.route('/api/topics/<topics_id>/platforms/<platform_id>/update', methods=['POST'])
@flask_login.login_required
@form_fields_required('platform_type', 'platform_query', 'platform_source', 'platform_channel')
@api_error_handler
def topic_update_platform(topics_id, platform_id):
    user_mc = user_mediacloud_client()
    channel = request.form['platform_channel'] if 'platform_channel' in request.form else None
    source = request.form['platform_source'] if 'platform_source' in request.form else None
    query = request.form['platform_query'] if 'platform_query' in request.form else None
    platform = request.form['platform_type']
    result = {}
    if platform == PLATFORM_OPEN_WEB:
        # here we need to parse the sources and collections out of the 'channel'
        sources, collections = parse_open_web_media_from_channel(channel)
        user_mc.topicUpdate(topics_id, media_ids=sources, media_tags_ids=collections, solr_seed_query=query)
        result['success'] = 1
        result['id'] = platform_id #web_shim_ui
    else:
        # TODO combine channel into query
        # Fake an update operation here by removing and then adding again
        result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id=platform_id)
        result = user_mc.topicAddSeedQuery(topics_id, platform, source, query)
        result['success'] = 1 if 'topic_seed_query' in result else 0
        result['id'] = result['topic_seed_query']['topic_seed_queries_id']

    return result #topic_seed_queries_id


@app.route('/api/topics/<topics_id>/platforms/<platform_id>/remove', methods=['POST'])
@flask_login.login_required
@form_fields_required('platform_type')
@api_error_handler
def topic_remove_platform(topics_id, platform_id):
    user_mc = user_mediacloud_client()
    platform = request.form['platform_type']
    if platform == PLATFORM_OPEN_WEB: # web_ui_shim that is
        result = user_mc.topicUpdate(topics_id, solr_seed_query='', media_ids=[], media_tags_ids=[])
    else:
        result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id = platform_id)
    return jsonify(result)
