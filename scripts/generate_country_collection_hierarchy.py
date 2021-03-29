"""
First pass at a script to generate a hierarchy of country collections. This saves a static file that is then used
to display country collections in the UI.
"""

import json
import os
import logging
import iso3166
import sys

from server import base_dir
from server.scripts.gen_tags_in_tag_set_json import write_tags_in_set_to_json, tag_set_json_file_path
import server.util.tags as tag_util

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# first cache the list of all the geo collections locally
FETCH_GEO_COLLECTIONS_SET = False  # use the pre-generated one by default
if FETCH_GEO_COLLECTIONS_SET:
    logger.info("Building local cache of all geo collections...")
    write_tags_in_set_to_json([tag_util.TagSetDiscoverer().geo_collections_set], only_public_tags=False)
    logger.info(" done")

# load up this cache of the collections we just made
path = tag_set_json_file_path(tag_util.TagSetDiscoverer().geo_collections_set)
geo_collections = json.load(open(path))


# use the national collection naming convention to identify country names and map them to iso codes
national = [t for t in geo_collections['tags'] if t['label'] is not None and t['label'].endswith('- National')]
name_subs = {
    'Congo, The Democratic Republic of the': 'Congo, Democratic Republic of the',
    'Holy See (Vatican City State)': 'Holy See',
    'Macedonia, Republic of': 'North Macedonia',
    'Saint Helena': 'Saint Helena, Ascension and Tristan da Cunha',
    'Swaziland': 'Eswatini',
    'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland',
    'United States': 'United States of America',
}
countries = []
for t in national:
    name = t['label'].replace('- National', '').strip()
    country_info = None
    if name.upper() in iso3166.countries_by_name:
        country_info = iso3166.countries_by_name[name.upper()]
    elif name in name_subs:
        country_info = iso3166.countries_by_name[name_subs[name].upper()]
    else:
        logger.error("Can't find iso3166 info for {}".format(name))
    countries.append(dict(
        name=name,
        alpha2=country_info.alpha2,
        alpha3=country_info.alpha3,
        id=country_info.numeric,
        national_tags_id=t['tags_id']
    ))
logger.info("Identified {} country 'national' collections".format(len(countries)))

# build a list of countries identified to a list of the collections that are part of it
country2collections = []
for c in countries:
    # find the collections that are part of the country (based on naming convention)
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
#    if result['country']['name'] != 'Papua New Guinea' and\
#        result['country']['name'] != 'South Sudan' and\
#        result['country']['name'] !='Taiwan, Province of China' and\
#        result['country']['name'] != 'Equatorial New Guinea':
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
    'VEN': 'Venezuela',
    'TZA': 'Tanzania',
    'BOL': 'Bolivia',
    'MDA': 'Moldova',
    'FSM': 'Micronesia',
    'IRN': 'Iran',
    'PSE': 'Palestine',
    'TWN': 'Taiwan',
    'RUS': 'Russia',
    'SYR': 'Syria',
    'ITA': 'Italy'
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
