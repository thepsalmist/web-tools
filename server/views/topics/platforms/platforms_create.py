import logging
from flask import jsonify, request
import flask_login
from flask_login import current_user
import json
from server import app
from server.util.request import api_error_handler
from server.auth import user_mediacloud_client
from server.views.topics.topic import topic_summary
logger = logging.getLogger(__name__)

WEB_SEED_QUERY_PLACEHOLDER_ID = -1
WEB_SEED_QUERY_PLACEHOLDER = {'platform': 'web', 'source': 'web_ui_shim', 'query': '', 'topic_seed_queries_id': -1}

@app.route('/api/topics/platforms/all', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_platform_list(): #everything 1.0 platform but web, probably
    return jsonify({'results': [{'platform_type': '1.0', 'platform': 'reddit', 'query': 'dummy'}, {'platform_type': '1.0', 'platform': 'twitter', 'query': 'dummy'}]})


@app.route('/api/topics/<topics_id>/platforms/list', methods=['GET'])
@flask_login.login_required
def get_topic_platforms(topics_id):
    user_mc = user_mediacloud_client()
    available_platforms = [
        {'platform': 'reddit', 'source': 'pushshift.io', 'query': '', 'topic_seed_queries_id': -1},
        {'platform': 'twitter', 'source': 'pushshift.io', 'query': '', 'topic_seed_queries_id': -1},
        {'platform': 'twitter', 'source': 'crimson_hexagon', 'query': '', 'topic_seed_queries_id': -1},
        {'platform': 'facebook', 'source': 'crowd_tangle', 'query': '', 'topic_seed_queries_id': -1},
    ]
    topic = user_mc.topic(topics_id)
    # and add in the open web query, which isn't stored in topic_seed_queries for historical reasons :-(
    if topic['solr_seed_query'] not in [None, '']:
        web_seed_query = {'platform': 'web', 'source': 'web_ui_shim',
                          'query': topic['solr_seed_query'],
                          'media': topic['media_tags'],
                          'topic_seed_queries_id': 1}
    else:
        web_seed_query = WEB_SEED_QUERY_PLACEHOLDER
    available_platforms.insert(0, web_seed_query)  # important to have this one at start of list
    # now fill in with any seed queries that have been created
    for seed_query in topic['topic_seed_queries']:
        match = [p for p in available_platforms if (p['platform'] == seed_query['platform']) and (p['source'] == seed_query['source'])]
        if len(match) == 1:
            match['query'] = seed_query['query']
            match['topics_seed_queries_id'] = seed_query['topics_seed_queries_id']
    return jsonify({'results': available_platforms})


# TODO: maybe push this to js, we'll see
@app.route('/api/topics/<topics_id>/platforms/<topic_seed_queries_id>', methods=['GET'])
@flask_login.login_required
def get_platform_by_id(topics_id, topic_seed_queries_id):
    user_mc = user_mediacloud_client()
    topic = user_mc.topic(topics_id)
    if int(topic_seed_queries_id) == WEB_SEED_QUERY_PLACEHOLDER_ID: #web shim
        web_seed_query = WEB_SEED_QUERY_PLACEHOLDER
        web_seed_query['query'] = topic['solr_seed_query']
        web_seed_query['media'] = topic['media_tags']
    else:
        web_seed_query = [s for s in topic['topic_seed_queries'] if s['topic_seed_query_id']== topic_seed_queries_id]
    return jsonify({'results': web_seed_query})


@app.route('/api/topics/<topics_id>/snapshots/update-seed-query', methods=['PUT'])
@flask_login.login_required
@api_error_handler
def topic_update_by_web_platform(topics_id):
    # update the seed query first 5 MUST be filled in)
    args = {
        'solr_seed_query': request.form['platform_query'] if 'platform_query' in request.form else None,
        'is_public': request.form['is_public'] if 'is_public' in request.form else None,
        'is_logogram': request.form['is_logogram'] if 'is_logogram' in request.form else None,
        'ch_monitor_id': request.form['ch_monitor_id'] if 'ch_monitor_id' in request.form
                                                          and request.form['ch_monitor_id'] is not None
                                                          and request.form['ch_monitor_id'] != 'null'
                                                          and len(request.form['ch_monitor_id']) > 0 else None,
        'max_iterations': request.form['max_iterations'] if 'max_iterations' in request.form else None,
        'max_stories': request.form['max_stories'] if 'max_stories' in request.form and request.form['max_stories'] != 'null' else current_user.profile['limits']['max_topic_stories'],
        'twitter_topics_id': request.form['twitter_topics_id'] if 'twitter_topics_id' in request.form else None
    }
    # parse out any sources and collections to add
    media = json.loads(request.form['channel'])
    media = media['channel']
    sources = media['sources[]'] if 'sources[]' in media and not [None, ''] else ''
    collections = media['collections[]'] if 'collections[]' in media else ''

    # hack to support twitter-only topics
    if (len(sources) is 0) and (len(collections) is 0):
        sources = None
        collections = None
    # update the seed query (the client will start the spider themselves
    user_mc = user_mediacloud_client()
    result = user_mc.topicUpdate(topics_id, media_ids=sources, media_tags_ids=collections, **args)
    return topic_summary(topics_id)  # give them back new data, so they can update the client


@app.route('/api/topics/<topics_id>/platforms/add', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_add_platform(topics_id):
    user_mc = user_mediacloud_client()
    platform = request.form['current_platform_type']
    query = request.form['platform_query']

    channel = request.form['channel'] if 'channel' in request.form else None

    source = request.form['source'] if 'source' in request.form else None

    if platform == 'web':
        # channel has open web sources in it
        result = topic_update_by_web_platform(topics_id) #and the request.form info
        # TODO - add retweet partisanship? or will that be handled in the back end
    else:
    # do we need to add dates?
    # TODO format channel properly for twitter
        result = user_mc.topicAddSeedQuery(topics_id=topics_id, platform=platform, source=source, query=query)

    result['success'] = result['topic_seed_query']['topic_seed_queries_id']
    return jsonify(result) #topic_seed_queries_id



@app.route('/api/topics/<topics_id>/platforms/<platform_id>/update', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_update_platform(topics_id, platform_id):
    user_mc = user_mediacloud_client()

    channel = request.form['channel'] if 'channel' in request.form else None
    source = request.form['source'] if 'source' in request.form else None
    query = request.form['query'] if 'query' in request.form else None
    platform = request.form['current_platform_type']
    #channel has open web sources in it
    #so, if source is mediacloud, do something with the channel
    # NOTE: dates are not modified - they are set at the topic level. TODO: confirm user can change dates in topic settings
    if platform == 'web':
        result = topic_update_by_web_platform(topics_id)  # and the request.form info
    else:
    #   result = user_mc.topicUpdateSeedQuery(topics_id, platform_id, source)
        result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id =platform_id)
        result = user_mc.topicAddSeedQuery(topics_id, platform, source, query)
    #result['success'] = result['topic_seed_query']['topic_seed_queries_id']
    return result #topic_seed_queries_id


@app.route('/api/topics/<topics_id>/platforms/<platform_id>/remove', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_remove_platform(topics_id, platform_id):
    user_mc = user_mediacloud_client()
    platform = request.form['current_platform_type']
    if platform == 'web': # web_ui_shim that is
        result = user_mc.topicUpdate(topics_id, solr_seed_query='', media_ids=[], media_tags_ids=[])
    else:
        result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id = platform_id)
    return jsonify(result)
