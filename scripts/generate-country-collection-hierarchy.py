"""
First pass at a script to generate a hierarchy of country collections. This saves a static file that is then used
to display country collections in the UI.
"""

import json
import os
import logging

from server import base_dir
from server.scripts.gen_tags_in_tag_set_json import write_tags_in_set_to_json
import server.util.tags as tag_util

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# first cache the list of all the geo collections locally
logger.info("Building local cache of all geo collections...")
write_tags_in_set_to_json([tag_util.TAG_SET_ABYZ_GEO_COLLECTIONS], only_public_tags=False)
logger.info(" done")

# load up this cache of the collections
path = os.path.join(base_dir, 'server', 'static', 'data', 'tags_in_15765102.json')
geo_collections = json.load(open(path))

# use the national collection naming convention to identify country names
national = [t for t in geo_collections['tags'] if t['label'] and t['label'].endswith(' - National')]
countries = [{'name': t['label'][:-11], 'alpha3': t['tag'][-3:], 'tagsId': t['tags_id']} for t in national]
logger.info("Idenfitied {} country 'national' collections".format(len(countries)))

# build a list of countries identified to a list of the collections that are part of it
country2collections = []
for c in countries:
    collections = [
        t for t in geo_collections['tags']
            if t['label'] and (t['label'].endswith(c['name']) or
               t['label'].endswith(c['name']+' - State & Local') or
               t['label'].endswith(c['name']+' - National'))
        ]
    result = {
        'country': c,
        'collections': collections
    }
    country2collections.append(result)
matched = []
for r in country2collections:
    matched += r['collections']

# find missing countries that the above trick did not work for
logger.info("Looking for missing countries")
unassociated = geo_collections['tags']
for r in matched:
    for u in unassociated:
        if r['tags_id'] == u['tags_id']:
            unassociated.remove(u)
country2tags = {}
for u in unassociated:
    # working with 'Gaza, Palestine - State & Local'
    if u['label']:
        country_name = u['label'].split(',')[-1]
        country_name = country_name.split(' - ')[0].strip()
        if country_name not in country2tags:
            country2tags[country_name] = []
        country2tags[country_name].append(u)
logger.info("  found {} unassociated countries:".format(len(country2tags.keys())))
logger.info("     {}".format(", ".join(country2tags.keys())))
# now map them back to the country
country_name_substitutions = {
    'TWN': 'Taiwan',
    'IRN': 'Iran',
    'PSE': 'Palestine',
    'RUS': 'Russia',
    'FSM': 'Micronesia',
    'MDA': 'Moldova',
    'SYR': 'Syria',
    'VEN': 'Venezuela',
    'TZA': 'Tanzania',
    'BOL': 'Bolivia'
}
for alpha3, short_name in country_name_substitutions.items():
    for c in country2collections:
        if c['country']['alpha3'] == alpha3:
            c['collections'] += country2tags[short_name]
matched = []
for r in country2collections:
    matched += r['collections']

logger.info("  {} geo collections".format(len(geo_collections['tags'])))
logger.info("  {} countries found".format(len(country2collections)))
logger.info("  {} collections mapped to countries".format(len(matched)))

# and now dump out the hierarchy to JSON
output_path = os.path.join(base_dir, 'server', 'static', 'data', 'country-collections.json')
with open(output_path, 'w') as outfile:
    outfile.write(json.dumps(country2collections, sort_keys=True, indent=2))
logger.info("Wrote results to {}".format(output_path))
