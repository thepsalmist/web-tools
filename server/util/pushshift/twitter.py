import requests
import collections
import json
import sys

from server.cache import cache
from server.util.api_helper import combined_split_and_normalized_counts

PS_TWITTER_SEARCH_URL = 'https://twitter-es.pushshift.io/twitter_verified/_search'


def _cached_query(query, limit, sort):
    headers = {'Content-type': 'application/json'}
    q = collections.defaultdict(lambda: collections.defaultdict(dict))
    q['query']['match']['text'] = "robots"
    q['sort']['created_at'] = sort
    q['size'] = limit
    r = requests.get(PS_TWITTER_SEARCH_URL, headers=headers, data=q)
    return r.json()


def search(query, filter=None, start_date=None, end_date=None, limit=100, sort='desc'):
    data = _cached_query(query, limit, sort)
    return data


'''
def query_es(term):
    base_url = 'https://twitter-es.pushshift.io/twitter_verified/_search'
    headers = {'Content-type': 'application/json'}
    q = collections.defaultdict(lambda : collections.defaultdict(dict))
    q['query']['match']['text'] = term
    q['sort']['created_at'] = 'desc'
    q['size'] = 100
    r = requests.get(base_url, headers=headers, data=q)
    if r.status_code == 200:
        return r.json()
    else:
        sys.exit(r.content)

result = query_es('tornadoes|tornado')

if 'hits' in result:
    for obj in result['hits']['hits']:
        tweet = obj['_source']
        print(tweet)
'''
