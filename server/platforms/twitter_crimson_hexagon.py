import datetime as dt
import requests
from operator import itemgetter
from typing import List, Dict
import logging

from server.platforms.provider import ContentProvider, MC_DATE_FORMAT
from server.cache import cache

CRIMSON_HEXAGON_BASE_URL = 'https://api.crimsonhexagon.com/api/monitor/'
CRIMSON_HEXAGON_DATE_FORMAT = '%Y-%m-%d'


class TwitterCrimsonHexagonProvider(ContentProvider):

    def __init__(self, api_key):
        super(TwitterCrimsonHexagonProvider, self).__init__()
        self._logger = logging.getLogger(__name__)
        self._api_key = api_key

    def sample(self, query: str, start_date: dt.datetime, end_date: dt.datetime, limit: int = 20,
               **kwargs) -> List[Dict]:
        """
        This is isn't returning actualy tweet content, so we're just gonna not show anything for now
        :param query:
        :param start_date:
        :param end_date:
        :param limit:
        :param kwargs: monitor_id
        :return:
        """
        return []
        '''
        params = {
            'id': kwargs['monitor_id'],
        }
        results = self._cached_query2('posts', start_date, end_date, params)
        data = []
        for tweet in results['posts'][:limit]:
            data.append(self._tweet_to_row(tweet))
        return data
        '''

    def count(self, query: str, start_date: dt.datetime, end_date: dt.datetime, **kwargs) -> int:
        """
        The number of tweets in the  monitor.
        :param query:
        :param start_date:
        :param end_date:
        :param kwargs: monitor_id
        :return:
        """
        params = {
            'id': kwargs['monitor_id'],
            'groupBy': 'DAILY',
        }
        results = self._cached_query2('volume', start_date, end_date, params)
        return results['numberOfDocuments']

    def count_over_time(self, query: str, start_date: dt.datetime, end_date: dt.datetime, **kwargs) -> Dict:
        """
        The number of tweets in the  monitor, broken out by day.
        :param query:
        :param start_date:
        :param end_date:
        :param kwargs: monitor_id
        :return:
        """
        params = {
            'id': kwargs['monitor_id'],
            'groupBy': 'DAILY',
        }
        results = self._cached_query2('volume', start_date, end_date, params)
        data = []
        for d in results['volume']:
            item_start_date = dt.datetime.strptime(d['startDate'][:10], CRIMSON_HEXAGON_DATE_FORMAT)
            data.append({
                'date': item_start_date.strftime(MC_DATE_FORMAT),
                'timestamp': item_start_date.timestamp(),
                'count': d['numberOfDocuments'],
            })
        return {'counts': data}

    def words(self, query: str, start_date: dt.datetime, end_date: dt.datetime, limit: int = 100, **kwargs) -> List[Dict]:
        """
        The top words in tweets in the monitor.
        :param query:
        :param start_date:
        :param end_date:
        :param limit:
        :param kwargs: monitor_id
        :return:
        """
        params = {
            'id': kwargs['monitor_id'],
        }
        results = self._cached_query2('wordcloud', start_date, end_date, params)
        data = []
        for term, freq in results['data'].items():
            data.append({
                'count': freq,
                'stem': term,
                'term': term,
            })
        data = sorted(data, key=itemgetter('count'), reverse=True)
        return data[:limit]

    @cache.cache_on_arguments()
    def _cached_query2(self, url, start_date: dt.datetime, end_date: dt.datetime, params: Dict) -> Dict:
        """
        :param url:
        :param start_date:
        :param end_date:
        :param params:
        :return:
        """
        headers = {'Content-type': 'application/json'}
        params['auth'] = self._api_key
        params['start'] = start_date.strftime(CRIMSON_HEXAGON_DATE_FORMAT)[:10]
        params['end'] = end_date.strftime(CRIMSON_HEXAGON_DATE_FORMAT)[:10]
        r = requests.get(CRIMSON_HEXAGON_BASE_URL+url, headers=headers, params=params)
        return r.json()

    @classmethod
    def _tweet_to_row(cls, item):
        return {
            'media_name': 'Twitter',
            'media_url': '/'.join(item['url'].split('/')[:4]),
            'full_link': item['url'],
            'stories_id': item['url'].split('/')[-1],
            'title': item['title'],
            'publish_date': 'unknown',
            'url': item['url'],
            'last_updated': 'unknown',
            'author': item['url'].split('/')[3],
            'language': item['language'],
            'retweet_count': '?',
            'favorite_count': '?',
        }
