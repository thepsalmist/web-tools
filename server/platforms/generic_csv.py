import datetime as dt
import collections
import csv
from typing import List, Dict
import random
import logging
import os

from server import app
from server.platforms.provider import ContentProvider, MC_DATE_FORMAT
# from server.cache import cache


class GenericCsvProvider(ContentProvider):
    """
    User uploads a CSV with content they've gotten from some platofrm we don't provide.
    Required fields: content, author, publish_date
    Optional fields: channel, url, post_id
    """

    def __init__(self, path_to_file: str = None):
        super(GenericCsvProvider, self).__init__()
        self._logger = logging.getLogger(__name__)
        if path_to_file is not None:
            self._data = self._load_from_file(path_to_file)

    def set_filename(self, filename: str):
        path_to_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        self._data = self._load_from_file(path_to_file)

    def _load_from_file(self, path_to_file: str) -> List[Dict]:
        data = []
        with open(path_to_file, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                data.append(row)
        return data

    def sample(self, query: str, start_date: dt.datetime, end_date: dt.datetime, limit: int = 20, **kwargs) -> List[Dict]:
        """
        Return a list of random content .
        :param query:
        :param start_date:
        :param end_date:
        :param kwargs:
        :return:
        """
        return [self._content_to_row(item) for item in random.sample(self._data, min(len(self._data), limit))]

    def count(self, query: str, start_date: dt.datetime, end_date: dt.datetime, **kwargs) -> int:
        """
        Count how many items are in the CSV
        :param query:
        :param start_date:
        :param end_date:
        :param kwargs:
        :return:
        """
        return len(self._data)

    def count_over_time(self, query: str, start_date: dt.datetime, end_date: dt.datetime, **kwargs) -> Dict:
        """
        How many items match are in the CSV by day?
        :param query:
        :param start_date:
        :param end_date:
        :param kwargs:
        :return:
        """
        groups = collections.defaultdict(list)
        for obj in self._data:
            groups[obj['publish_date']].append(obj)
        results = [{
            'date': date,
            'timestamp': dt.datetime.strptime(date, MC_DATE_FORMAT).timestamp(),
            'count': len(items),
        } for date, items in groups.items()]
        return {'counts': results}

    def words(self, query: str, start_date: dt.datetime, end_date: dt.datetime, **kwargs) -> List[Dict]:
        """
        We don't have a way to get word counts from the CSV, do we?
        :param query:
        :return:
        """
        return []

    @classmethod
    def _content_to_row(cls, item):
        return {
            'author': item['author'],
            'publish_date': item['publish_date'],
            'title': item['content'][0:100],
            'media_name': 'CVS Upload',
            'media_url': None,
            'url': item['url'] if 'url' in item else None,
        }

