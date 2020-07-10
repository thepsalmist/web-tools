"""
This writes all the collections in a tag set to a json file.  This is useful for caching tag_sets that don't change 
often.
"""
import logging
import sys
import json
import os

from server import mc, TOOL_API_KEY, data_dir
import server.views.sources.apicache as apicache

logger = logging.getLogger(__name__)


def tag_set_json_file_path(tag_sets_id):
    """
    A helper to standardize the naming of locally cached files that contain lists of all the tags in a "static"
    tag set. We cache these locally for tag sets that don't change, so that we don't need to hit the backend server
    any time we need to list the tags in a tagSet. For instance with the media source metadata tags.
    :param tag_sets_id:
    :return:
    """
    filename = "tags_in_{}.json".format(tag_sets_id)
    return os.path.join(data_dir, filename)


def write_tags_in_set_to_json(tag_sets_id_list, only_public_tags=True, filepath=None):
    logger.info("Starting to generate a list of all the collections in tag sets: {}".format(tag_sets_id_list))
    for tag_sets_id in tag_sets_id_list:
        auto_file_path = tag_set_json_file_path(tag_sets_id)
        tag_set = mc.tagSet(tag_sets_id)
        logger.info("  {}".format(tag_set['label']))
        tags_list = apicache.tags_in_tag_set(TOOL_API_KEY, tag_sets_id, only_public_tags)
        output_filepath = auto_file_path if filepath is None else filepath
        with open(output_filepath, 'wb') as f:
            json.dump(tags_list, f, ensure_ascii=False)
        logger.info("    wrote {} collections to {}".format(len(tags_list['tags']), auto_file_path))
    logger.info("Done")


if __name__ == '__main__':
    if len(sys.argv) == 1:
        logger.error("You need to pass in a tag set id (tag_sets_id)!")
        sys.exit()
    tag_sets_ids = sys.argv[1:]
    write_tags_in_set_to_json(tag_sets_ids)
