from psaw import PushshiftAPI
from deco import concurrent, synchronized
from collections import defaultdict

from server.cache import cache

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
