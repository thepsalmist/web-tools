# -*- coding: utf-8 -*-
import logging
import json
from flask import jsonify, request
import flask_login
from server import app
from server.auth import user_admin_mediacloud_client, user_mediacloud_client
from server.util.request import form_fields_required, api_error_handler, json_error_response
from server.util.stringutil import ids_from_comma_separated_str
from server.views.topics import concatenate_query_for_solr, concatenate_solr_dates

# load the shared settings file

logger = logging.getLogger(__name__)


@app.route('/api/topics/create/preview/split-story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_split_story_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = concatenate_query_for_solr(solr_seed_query=request.form['q'],
                                            media_ids=ids_from_comma_separated_str(request.form['sources[]']) if 'sources[]' in request.form else None,
                                            tags_ids=ids_from_comma_separated_str(request.form['collections[]'])) if 'collections[]' in request.form else None,
    fq = concatenate_solr_dates(start_date=request.form['start_date'],
                                            end_date=request.form['end_date'])
    results = user_mc.storyCount(solr_query=solr_query, solr_filter=fq, split=True)
    total_stories = 0
    for c in results['counts']:
        total_stories += c['count']
    results['total_story_count'] = total_stories
    return jsonify({'results': results})


@app.route('/api/topics/create/preview/story/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = concatenate_query_for_solr(solr_seed_query=request.form['q'],
                                            media_ids=ids_from_comma_separated_str(request.form['sources[]']) if 'sources[]' in request.form else None,
                                            tags_ids=ids_from_comma_separated_str(request.form['collections[]'])) if 'collections[]' in request.form else None,
    fq = concatenate_solr_dates(start_date=request.form['start_date'],
                                            end_date=request.form['end_date'])
    story_count_result = user_mc.storyCount(solr_query=solr_query, solr_filter=fq)
    # maybe check admin role before we run this?
    return jsonify(story_count_result)  # give them back new data, so they can update the client


@app.route('/api/topics/create/preview/stories/sample', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_story_sample():
    user_mc = user_mediacloud_client()

    solr_query = concatenate_query_for_solr(solr_seed_query=request.form['q'],
                                            media_ids=ids_from_comma_separated_str(request.form['sources[]']) if 'sources[]' in request.form else None,
                                            tags_ids=ids_from_comma_separated_str(request.form['collections[]'])) if 'collections[]' in request.form else None,

    fq = concatenate_solr_dates(start_date=request.form['start_date'],
                                            end_date=request.form['end_date'])
    num_stories = request.form['rows']
    story_count_result = user_mc.storyList(solr_query=solr_query, solr_filter=fq, sort=user_mc.SORT_RANDOM, rows=num_stories)
    return jsonify(story_count_result)


@app.route('/api/topics/create/preview/words/count', methods=['POST'])
@flask_login.login_required
@form_fields_required('q')
@api_error_handler
def api_topics_preview_word_count():
    user_mc = user_admin_mediacloud_client()

    solr_query = concatenate_query_for_solr(solr_seed_query=request.form['q'],
                                            media_ids=ids_from_comma_separated_str(request.form['sources[]']) if 'sources[]' in request.form else None,
                                            tags_ids=ids_from_comma_separated_str(request.form['collections[]'])) if 'collections[]' in request.form else None,
    fq = concatenate_solr_dates(start_date=request.form['start_date'],
                                            end_date=request.form['end_date'])
    word_count_result = user_mc.wordCount(solr_query=solr_query, solr_filter=fq)

    return jsonify(word_count_result)  # give them back new data, so they can update the client


@app.route('/api/topics/create', methods=['PUT'])
@flask_login.login_required
@form_fields_required('name', 'description', 'solr_seed_query', 'start_date', 'end_date')
@api_error_handler
def topic_create():
    user_mc = user_admin_mediacloud_client()
    name = request.form['name']
    description = request.form['description']
    solr_seed_query = request.form['solr_seed_query']
    start_date = request.form['start_date']
    end_date = request.form['end_date']

    optional_args = {
        'is_public': request.form['is_public'] if 'is_public' in request.form else None,
        'is_logogram': request.form['is_logogram'] if 'is_logogram' in request.form else None,
        'ch_monitor_id': request.form['ch_monitor_id'] if len(request.form['ch_monitor_id']) > 0 and request.form['ch_monitor_id'] != 'null' else None,
        'max_iterations': request.form['max_iterations'] if 'max_iterations' in request.form else None,
        'max_stories': request.form['max_stories'] if 'max_stories' in request.form and request.form['max_stories'] != 'null' else None,
    }

    # parse out any sources and collections to add
    media_ids_to_add = ids_from_comma_separated_str(request.form['sources[]'])
    tag_ids_to_add = ids_from_comma_separated_str(request.form['collections[]'])

    try:
        topic_result = user_mc.topicCreate(name=name, description=description, solr_seed_query=solr_seed_query,
                                           start_date=start_date, end_date=end_date, media_ids=media_ids_to_add,
                                           media_tags_ids=tag_ids_to_add, **optional_args)['topics'][0]

        topic_id = topic_result['topics_id']
        logger.info("Created new topic \"{}\" as {}".format(name, topic_id))
        spider_job = user_mc.topicSpider(topic_id)  # kick off a spider, which will also generate a snapshot
        logger.info("  spider result = {}".format(json.dumps(spider_job)))
        results = user_mc.topic(topic_id)
        results['spider_job_state'] = spider_job
        return jsonify(results)  # give them back new data, so they can update the client
    except Exception as e:
        logging.error("Topic creation failed {}".format(name))
        logging.exception(e)
        return json_error_response(e.message, e.status_code)
