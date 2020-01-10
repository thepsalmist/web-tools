from deco import concurrent, synchronized
from collections import defaultdict
import datetime as dt
import requests
from typing import List, Dict

from server.cache import cache
from server.util.api_helper import combined_split_and_normalized_counts
from server.util.dates import unix_to_solr_date

DB_TIME_STRING = "%Y-%m-%d %H:%M:%S"
NEWS_SUBREDDITS = ['politics', 'worldnews', 'news', 'conspiracy', 'Libertarian', 'TrueReddit', 'Conservative',
                   'offbeat']
PS_REDDIT_SEARCH_URL = 'https://api.pushshift.io/reddit/submission/search/?'


@cache.cache_on_arguments()
def _cached_submission_search(query: str = None, start_date: dt.datetime = None, end_date: dt.datetime = None,
                              subreddits: List[str] = None, **kwargs) -> Dict:
    headers = {'Content-type': 'application/json'}
    params = defaultdict()
    if query is not None:
        params['q'] = query
    if subreddits is not None:
        params['subreddit'] = ",".join(subreddits)
    if (start_date is not None) and (end_date is not None):
        params['after'] = unix_to_solr_date(int(start_date.timestamp()))
        params['before'] = unix_to_solr_date(int(end_date.timestamp()))
    # and now add in any other arguments they have sent in
    params.update(kwargs)
    r = requests.get(PS_REDDIT_SEARCH_URL, headers=headers, params=params)
    temp = r.url
    return r.json()


def _sanitize_url_for_reddit(url):
    return url.split('?')[0]


# total shares of a URL on reddit
@concurrent
def _url_submission_count(url: str):
    data = _cached_submission_search(url=_sanitize_url_for_reddit(url), aggs='created_utc', frequency='5y')
    if len(data['aggs']['created_utc']) == 0:
        return 0
    return data['aggs']['created_utc'][0]['doc_count']


@synchronized
def url_submission_counts(story_list: List[Dict]):
    results = defaultdict(dict)
    for s in story_list:
        results[s['stories_id']] = _url_submission_count(s['url'])
    return results


def url_submissions_by_subreddit(url: str):
    data = _cached_submission_search(url=_sanitize_url_for_reddit(url), aggs='subreddit', size=0)
    results = []
    for d in data['aggs']['subreddit']:
        results.append({
            'name': d['key'],
            'value': d['doc_count'],
        })
    return results


def submission_count(query: str, start_date: dt.datetime, end_date: dt.datetime, subreddits: List[str] = None) -> int:
    data = _cached_submission_search(q=query, subreddits=subreddits,
                                     start_date=start_date, end_date=end_date,
                                     aggs='created_utc', frequency='1y', size=0)
    if len(data['aggs']['created_utc']) == 0:
        return 0
    counts = [r['doc_count'] for r in data['aggs']['created_utc']]
    return sum(counts)


def submission_split_count(query: str, start_date: dt.datetime, end_date: dt.datetime,
                           subreddits: List[str] = None, period: str = '1d'):
    data = _cached_submission_search(q=query, subreddits=subreddits,
                                     start_date=start_date, end_date=end_date,
                                     aggs='created_utc', frequency=period, size=0)
    # make the results match the format we use for stories/count in the Media Cloud API
    results = []
    for d in data['aggs']['created_utc']:
        results.append({
            'date': dt.datetime.fromtimestamp(d['key']).strftime(DB_TIME_STRING),
            'timestamp': d['key'],
            'count': d['doc_count'],
        })
    return results


def submission_normalized_and_split_story_count(query: str, start_date: dt.datetime, end_date: dt.datetime,
                                                subreddits: List[str] = None):
    split_count = submission_split_count(query, start_date, end_date, subreddits=subreddits)
    matching_total = sum([d['count'] for d in split_count])
    split_count_without_query = submission_split_count('', start_date, end_date, subreddits=subreddits)
    no_query_total = sum([d['count'] for d in split_count_without_query])
    return {
        'counts': combined_split_and_normalized_counts(split_count, split_count_without_query),
        'total': matching_total,
        'normalized_total': no_query_total,
    }


def _submission_to_row(item):
    return {
        'media_name': '/r/{}'.format(item['subreddit']),
        'media_url': item['full_link'],
        'full_link': item['full_link'],
        'stories_id': item['id'],
        'title': item['title'],
        'publish_date': dt.datetime.fromtimestamp(item['created_utc']).strftime(DB_TIME_STRING),
        'url': item['url'],
        'score': item['score'],
        'last_updated': dt.datetime.fromtimestamp(item['updated_utc']).strftime(DB_TIME_STRING) if 'updated_utc' in item else None,
        'author': item['author'],
        'subreddit': item['subreddit']
    }


def _cached_top_submissions(**kwargs):
    data = _cached_submission_search(**kwargs)
    cleaned_data = [_submission_to_row(item) for item in data['data'][:kwargs['limit']]]
    return cleaned_data


def top_submissions(query: str, start_date: dt.datetime, end_date: dt.datetime, subreddits: List[str] = None,
                    limit: int = 20):
    data = _cached_top_submissions(q=query, subreddits=subreddits,
                                   start_date=start_date, end_date=end_date,
                                   limit=limit, sort='desc', sort_type='score')
    return data
