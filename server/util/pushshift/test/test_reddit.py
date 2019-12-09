import unittest
import datetime as dt

import server.util.pushshift.reddit as ps_reddit


class RedditSubmissionTest(unittest.TestCase):

    def testSubmissionsBySub(self):
        results = ps_reddit.reddit_url_submissions_by_subreddit("https://www.theguardian.com/")
        assert isinstance(results, list) is True
        assert 'name' in results[0]
        assert 'value' in results[0]
        assert results[0]['name'] == 'GUARDIANauto'  # automated reddit sub posting every story from Guardian

    def testSubmissionCount(self):
        results = ps_reddit.reddit_submissions_count("Trump", dt.datetime.strptime("2019-01-01", "%Y-%m-%d"),
                                                     dt.datetime.strptime("2019-02-01", "%Y-%m-%d"),
                                                     [])
        assert results > 0

    def testTopSubmissions(self):
        results = ps_reddit.reddit_top_submissions("Trump", dt.datetime.strptime("2019-01-01", "%Y-%m-%d"),
                                                   dt.datetime.strptime("2019-02-01", "%Y-%m-%d"),
                                                   [])
        last_score = 9999999999999
        for post in results:
            assert last_score >= post['score']
            last_score = post['score']

    def testSplitSubmissionCount(self):
        results = ps_reddit.reddit_submissions_split_count("Trump", dt.datetime.strptime("2019-01-01", "%Y-%m-%d"),
                                                           dt.datetime.strptime("2019-02-01", "%Y-%m-%d"),
                                                           [])
        for item in results:
            assert 'date' in item
            assert 'count' in item

    def testSubmissionNormalizedSplitCounts(self):
        results = ps_reddit.reddit_submission_normalized_and_split_story_count("Trump",
                                                                               dt.datetime.strptime("2019-01-01", "%Y-%m-%d"),
                                                                               dt.datetime.strptime("2019-02-01", "%Y-%m-%d"),
                                                                               [])
        assert 'counts' in results
        assert 'total' in results
        assert results['total'] > 0
        assert 'normalized_total' in results
