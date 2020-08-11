import flask_login
from flask import jsonify
import logging
from mediacloud.error import MCException

from server import app
from server.auth import user_mediacloud_key
from server.util.request import api_error_handler
import server.views.apicache as base_apicache
from server.views.topics import apicache
from server.views.stories import add_convenience_tags_to_story

logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/stories/<stories_id>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def story(topics_id, stories_id):
    story_topic_info = apicache.topic_story_list(user_mediacloud_key(), topics_id, stories_id=stories_id)
    story_topic_info = story_topic_info['stories'][0]
    try:
        story_info = base_apicache.story(stories_id)  # add in other fields from regular call
        for k in story_info.keys():
            story_topic_info[k] = story_info[k]
        story_topic_info = add_convenience_tags_to_story(story_topic_info)
    except MCException:
        logger.warning("Story {} wasn't found in a regular story API call, but is it topic {}".format(
            stories_id, topics_id
        ))
    return jsonify(story_topic_info)
