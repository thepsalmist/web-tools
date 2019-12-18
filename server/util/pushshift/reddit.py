from psaw import PushshiftAPI
from deco import concurrent, synchronized
from collections import defaultdict
import datetime as dt

from server.cache import cache
from server.util.api_helper import combined_split_and_normalized_counts

ps_api = PushshiftAPI()

DB_TIME_STRING = "%Y-%m-%d %H:%M:%S"

NEWS_SUBREDDITS = ['politics', 'worldnews', 'news', 'conspiracy', 'Libertarian', 'TrueReddit', 'Conservative',
                   'offbeat']


def _sanitize_url_for_reddit(url):
    return url.split('?')[0]


# total shares of a URL on reddit
@concurrent
def _url_submission_count(url):
    data = _cached_submission_search(url=_sanitize_url_for_reddit(url), aggs='created_utc', frequency='5y')
    if len(data['created_utc']) == 0:
        return 0
    return data['created_utc'][0]['doc_count']


@synchronized
def url_submission_counts(story_list):
    results = defaultdict(dict)
    for s in story_list:
        results[s['stories_id']] = _url_submission_count(s['url'])
    return results


def url_submissions_by_subreddit(url):
    data = _cached_submission_search(url=_sanitize_url_for_reddit(url), aggs='subreddit')
    results = []
    for d in data['subreddit']:
        results.append({
            'name': d['key'],
            'value': d['doc_count'],
        })
    return results


#@cache.cache_on_arguments()
def _cached_submission_search(**kwargs):
    gen = ps_api.search_submissions(**kwargs)
    return next(gen)


def _submission_search(**kwargs):
    gen = ps_api.search_submissions(**kwargs)
    return gen


def submission_count(query: str, start_date: dt.datetime, end_date: dt.datetime, subreddits=None):
    data = _cached_submission_search(q=query, subreddit=subreddits,
                                     after=int(start_date.timestamp()), before=int(end_date.timestamp()),
                                     aggs='created_utc', frequency='10y')
    if len(data['created_utc']) == 0:
        return 0
    return data['created_utc'][0]['doc_count']


def submission_split_count(query: str, start_date: dt.datetime, end_date: dt.datetime,
                           subreddits=None, period='1d'):
    data = _cached_submission_search(q=query, subreddit=subreddits,
                                     after=int(start_date.timestamp()), before=int(end_date.timestamp()),
                                     aggs='created_utc', frequency=period)
    # make the results match the format we use for stories/count in the Media Cloud API
    results = []
    for d in data['created_utc']:
        results.append({
            'date': dt.datetime.fromtimestamp(d['key']).strftime(DB_TIME_STRING),
            'timestamp': d['key'],
            'count': d['doc_count'],
        })
    return results


def submission_normalized_and_split_story_count(query, start_date, end_date, subreddits=None):
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
        'media_name': '/r/{}'.format(item.subreddit),
        'media_url': item.full_link,
        'full_link': item.full_link,
        'stories_id': item.id,
        'title': item.title,
        'publish_date': dt.datetime.fromtimestamp(item.created_utc).strftime(DB_TIME_STRING),
        'url': item.url,
        'score': item.score,
        'last_updated': dt.datetime.fromtimestamp(item.updated_utc).strftime(DB_TIME_STRING) if 'updated_utc' in item else None,
        'author': item.author,
        'subreddit': item.subreddit
    }


#@cache.cache_on_arguments()
def _cached_top_submissions(**kwargs):
    data = _submission_search(**kwargs)
    cleaned_data = []
    try:
        for row in range(0, kwargs['limit']):
            item = next(data)
            item_data = _submission_to_row(item)
            cleaned_data.append(item_data)
    except StopIteration:
        # not really a problem, just an indication that we have less than kwargs['limit'] results
        pass
    return cleaned_data


def top_submissions(query, start_date, end_date, subreddits=None, limit=20):
    data = _cached_top_submissions(q=query, subreddit=subreddits,
                                   after=int(start_date.timestamp()), before=int(end_date.timestamp()),
                                   limit=limit, sort='desc', sort_type='score')
    return data
