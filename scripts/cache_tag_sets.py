"""
This helper caches some tag sets that we use all the time to json files. This is helpful because those
tag sets don't change very often, so reading them from json is much faster than querying the back-end and 
caching in memory.
"""

from server.scripts.gen_tags_in_tag_set_json import write_tags_in_set_to_json
from server.util.tags import TagSetDiscoverer

tag_sets_to_cache = TagSetDiscoverer().media_metadata_sets()

write_tags_in_set_to_json(tag_sets_to_cache, only_public_tags=False)
