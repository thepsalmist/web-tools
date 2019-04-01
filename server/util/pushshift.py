from psaw import PushshiftAPI
from deco import concurrent, synchronized
from collections import defaultdict

ps_api = PushshiftAPI()


# total shares of a URL on reddit
@concurrent
def _reddit_url_submissions_for(url):
    gen = ps_api.search_submissions(url=url, aggs='created_utc', frequency='5y')
    data = next(gen)
    if len(data['created_utc']) == 0:
        return 0
    return data['created_utc'][0]['doc_count']


@synchronized
def reddit_url_submission_counts(story_list):
    results = defaultdict(dict)
    for s in story_list:
        results[s['stories_id']] = _reddit_url_submissions_for(s['url'])
    return results
