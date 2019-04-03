from psaw import PushshiftAPI
from deco import concurrent, synchronized
from collections import defaultdict
import datetime as dt

from server.cache import cache
from server.util.api_helper import combined_split_and_normalized_counts

ps_api = PushshiftAPI()


def _sanitize_url_for_reddit(url):
    return url.split('?')[0]


# total shares of a URL on reddit
@concurrent
def _reddit_url_submissions_for(url):
    data = _cached_reddit_submission_search(url=_sanitize_url_for_reddit(url), aggs='created_utc', frequency='5y')
    if len(data['created_utc']) == 0:
        return 0
    return data['created_utc'][0]['doc_count']


@synchronized
def reddit_url_submission_counts(story_list):
    results = defaultdict(dict)
    for s in story_list:
        results[s['stories_id']] = _reddit_url_submissions_for(s['url'])
    return results


def reddit_url_submissions_by_subreddit(url):
    data = _cached_reddit_submission_search(url=_sanitize_url_for_reddit(url), aggs='subreddit')
    results = []
    for d in data['subreddit']:
        results.append({
            'name': d['key'],
            'value': d['doc_count'],
        })
    return results


@cache.cache_on_arguments()
def _cached_reddit_submission_search(**kwargs):
    gen = ps_api.search_submissions(**kwargs)
    return next(gen)


def reddit_submissions_count(query: str, start_date: dt.datetime, end_date: dt.datetime, subreddits=None):
    data = _cached_reddit_submission_search(q=query, subreddit=subreddits,
                                            after=int(start_date).timestamp(), before=int(end_date).timestamp(),
                                            aggs='created_utc', frequency='10y')
    if len(data['created_utc']) == 0:
        return 0
    return data['created_utc'][0]['doc_count']


def reddit_submissions_split_count(query: str, start_date: dt.datetime, end_date: dt.datetime,
                                 subreddits=None, period='1d'):
    data = _cached_reddit_submission_search(q=query, subreddit=subreddits,
                                            after=int(start_date.timestamp()), before=int(end_date.timestamp()),
                                            aggs='created_utc', frequency=period)
    # make the results match the format we use for stories/count in the Media Cloud API
    results = []
    for d in data['created_utc']:
        results.append({
            'date': dt.datetime.fromtimestamp(d['key']).strftime("%Y-%m-%d %H:%M:%S"),
            'count': d['doc_count'],
        })
    return results


def reddit_submission_normalized_and_split_story_count(query, start_date, end_date):
    split_count = reddit_submissions_split_count(query, start_date, end_date)
    matching_total = sum([d['count'] for d in split_count])
    split_count_without_query = reddit_submissions_split_count('', start_date, end_date)
    no_query_total = sum([d['count'] for d in split_count_without_query])
    return {
        'counts': combined_split_and_normalized_counts(split_count, split_count_without_query),
        'total': matching_total,
        'normalized_total': no_query_total,
    }
