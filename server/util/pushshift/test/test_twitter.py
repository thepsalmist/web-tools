import unittest
import datetime as dt
import dateutil.relativedelta

import server.util.pushshift.twitter as ps_twitter


class TwitterTest(unittest.TestCase):

    def testSearch(self):
        results = ps_twitter.search("robots")
        assert isinstance(results, list) is True
        assert 'name' in results[0]
        assert 'value' in results[0]
        assert results[0]['name'] == 'GUARDIANauto'  # automated reddit sub posting every story from Guardian

