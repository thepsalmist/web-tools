import logging
from flask import jsonify, request
import flask_login
from flask_login import current_user
import json
from server import app
from server.util.request import api_error_handler
from server.auth import user_mediacloud_client
from server.views.topics.topicsnapshot import topic_update
from server.util.stringutil import ids_from_comma_separated_str
from server.views.topics.topic import topic_summary
logger = logging.getLogger(__name__)

OPEN_WEB = 1
WEB_SEED_SHIM = {'platform_type': 'web_ui_shim', 'platform': 'web',
     'topic_seed_queries_id': 9999}  # TODO, assuming seed query ids are 0-10 or so

TWITTER_SEED_SHIM = {'platform_type': 'twitter_ui_shim', 'platform': 'twitter',
    'topic_seed_queries_id': 9998,
    'channel': [
        { 'type': 'elite', 'id': 0, 'label': 'Elite', 'selected': True, 'value': True },
        { 'type': 'crimson', 'id': 1, 'label': 'Crimson Hexagon', 'selected': True, 'value': True },
        { 'type': 'other', 'id': 2, 'label': 'Other', 'selected': False, 'value': False }
    ]
}  # TODO, assuming seed query ids are 0-10 or so


@app.route('/api/topics/platforms/all', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_platform_list(): #everything 1.0 platform but web, probably
    return jsonify({'results': [{'platform_type': '1.0', 'platform': 'reddit', 'query': 'dummy'}, {'platform_type': '1.0', 'platform': 'twitter', 'query': 'dummy'}]})


@app.route('/api/topics/<topics_id>/platforms/list', methods=['GET'])
@flask_login.login_required
def get_topic_platforms(topics_id):
    user_mc = user_mediacloud_client()
    # media_type_tags = tags_in_tag_set(TOOL_API_KEY, TAG_SETS_ID_MEDIA_TYPE)
    # how do we get all the seed queries per topic ?
    #merge what the topic has versus what the topic doens't by adding in the topic_seed_queries_id
    # TODO fetch platforms from topic
    # TODO add in channel for display in UI
    dummy_dict = [{'platform_type': 'web_ui_shim', 'platform': 'web', 'query': 'dummy', 'topic_seed_queries_id': -1}, {'platform_type': '1.0','platform': 'reddit', 'query': 'dummy', 'topic_seed_queries_id': -1}, {'platform_type': 'twitter-ui-shim','platform': 'twitter', 'query': 'dummy', 'topic_seed_queries_id': 9998}]

    topic = user_mc.topic(topics_id)
    non_web_seed_queries = topic['topic_seed_queries']
    if topic['solr_seed_query'] not in [None, '']:
        #channel - the media ids sources, collections
        web_seed_query = WEB_SEED_SHIM
        web_seed_query['query'] = topic['solr_seed_query']
        web_seed_query['media'] = topic['media_tags']
        non_web_seed_queries.extend([web_seed_query])
    seed_queries = dummy_dict
    seed_queries.extend(non_web_seed_queries)
    return jsonify({'results': seed_queries})


# maybe push this to js, we'll see
@app.route('/api/topics/<topics_id>/platforms/<platform_id>', methods=['GET'])
@flask_login.login_required
def get_platform_by_id(topics_id, platform_id):
    # iterate through topic seed queries array
    user_mc = user_mediacloud_client()
    results = "not implemented for all platforms"
    topic = user_mc.topic(topics_id)
    platform_info={}
    if int(platform_id) == 9999: #web shim
        logger.info("web shim platform retrieved")
        platform_info = WEB_SEED_SHIM
        platform_info['query'] = topic['solr_seed_query']
        platform_info['media'] = topic['media_tags']
    elif int(platform_id) == 9998: #twitter shim
        logger.info("twitter shim platform retrieved")
        platform_info = TWITTER_SEED_SHIM
        platform_info['query'] = topic['solr_seed_query']
        #platform_info['channel'] = topic['channel']
    else:
        platform_info = {s for s in topic['topic_seed_queries'] if s['topic_seed_query_id']== platform_id}
    return jsonify({'results': platform_info})


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
