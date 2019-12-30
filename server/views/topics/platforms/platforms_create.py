import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import api_error_handler
from server.auth import user_mediacloud_client
from server.views.topics.topicsnapshot import topic_update
logger = logging.getLogger(__name__)

OPEN_WEB = 1
WEB_SEED_SHIM = {'platform_type': 'web_ui_shim', 'platform': 'web',
     'topic_seed_queries_id': 9999}  # TODO, assuming seed query ids are 0-10 or so


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
    dummy_dict = [{'platform_type': 'web_ui_shim', 'platform': 'web', 'query': 'dummy', 'topic_seed_queries_id': -1}, {'platform_type': '1.0','platform': 'reddit', 'query': 'dummy', 'topic_seed_queries_id': -1}, {'platform_type': '1.0','platform': 'twitter', 'query': 'dummy', 'topic_seed_queries_id': -1}]

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
    if int(platform_id) == 9999: #web shim
        logger.info("shim platform retrieved")
        web_seed_query = WEB_SEED_SHIM
        web_seed_query['query'] = topic['solr_seed_query']
        web_seed_query['media'] = topic['media_tags']
    else:
        web_seed_query = {s for s in topic['topic_seed_queries'] if s['topic_seed_query_id']== platform_id}
    return jsonify({'results': web_seed_query})


@app.route('/api/topics/<topics_id>/platforms/add', methods=['POST'])
@flask_login.login_required
@api_error_handler
def topic_add_platform(topics_id):
    user_mc = user_mediacloud_client()
    platform = request.form['current_platform_type']
    query = request.form['platform_query']

    channel = request.form['channel'] if 'channel' in request.form else None
    #channel has open web sources in it
    #so,    if source is mediacloud, do something with the channel
    source = request.form['source'] if 'source' in request.form else None

    if platform == 'web':
        #update topic as previously
        result = topic_update(topics_id) #and the request.form info
    else:
    # do we need to add dates?
        result = user_mc.topicAddSeedQuery(topics_id, platform, source, query)

    result['success'] = result['topic_seed_query']['topic_seed_queries_id']
    return jsonify(result) #topic_seed_queries_id

#if this is an open web platform, do we need to do any of this (from topic creation):
    # parse out any sources and collections, or custom collections to add
    #media_ids_to_add = ids_from_comma_separated_str(request.form['sources[]'])
    #tag_ids_to_add = ids_from_comma_separated_str(request.form['collections[]'])
    #custom_collections_clause = custom_collection_as_solr_query(request.form['searches[]'])
    #if len(custom_collections_clause) > 0:
    #    solr_seed_query = '{} OR {}'.format(solr_seed_query, custom_collections_clause)

#if set(tag_ids_to_add).intersection(US_COLLECTIONS):
#    add_retweet_partisanship_to_topic(topic_result['topics_id'],
#                                      'Retweet Partisanship',
#                                      'Subtopics driven by our analysis of Twitter followers of Trump and Clinton during the 2016 election season.  Each media soure is scored based on the ratio of retweets of their stories in those two groups.')


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
        result = topic_update(topics_id)  # and the request.form info
    else:
    #   result = user_mc.topicUpdateSeedQuery(topics_id, platform_id, source)
        result = user_mc.topicRemoveSeedQuery(topics_id, topic_seed_queries_id =platform_id)
        result = user_mc.topicAddSeedQuery(topics_id, platform, source, query)
    #result['success'] = result['topic_seed_query']['topic_seed_queries_id']
    return jsonify({"results": result}) #topic_seed_queries_id


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
    return jsonify({"results": result})
