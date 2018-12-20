import flask_login
from flask import request, jsonify
import logging

from server import app
from server.auth import user_mediacloud_key
from server.util.request import api_error_handler, filters_from_args, json_error_response
from server.views.topics import apicache as apicache

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/split-story/focal-set/<focal_sets_id>/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_focal_set_split_stories_compare(topics_id, focal_sets_id):
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    # need the timespan info, to find the appropriate timespan with each focus
    base_snapshot_timespans = apicache.cached_topic_timespan_list(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id)
    # if they have a focus selected, we need to find the appropriate overall timespan
    if foci_id is not None:
        timespan = apicache.topic_timespan(topics_id, snapshots_id, foci_id, timespans_id)
        for t in base_snapshot_timespans:
            if apicache.is_timespans_match(timespan, t):
                base_timespan = t
    else:
        base_timespan = None
        for t in base_snapshot_timespans:
            if t['timespans_id'] == int(timespans_id):
                base_timespan = t
                logger.info('base timespan = %s', timespans_id)
    if base_timespan is None:
        return json_error_response("Couldn't find the timespan you specified")
    # iterate through to find the one of interest
    focal_set = apicache.topic_focal_set(user_mediacloud_key(), topics_id, snapshots_id, focal_sets_id)
    if focal_set is None:
        return json_error_response('Invalid Focal Set Id')
    # collect the story split counts for each foci
    timespans = apicache.matching_timespans_in_foci(topics_id, base_timespan, focal_set['foci'])
    for idx in range(0, len(timespans)):
        data = apicache.topic_split_story_counts(user_mediacloud_key(), topics_id, snapshots_id=snapshots_id,
                                                 timespans_id=timespans[idx]['timespans_id'])
        focal_set['foci'][idx]['split_story_counts'] = data
    return jsonify(focal_set)
