import logging
from operator import itemgetter

import server.views.sources.apicache as apicache
import server.util.csv as csv
from server.util.stringutil import trimSolrDate

logger = logging.getLogger(__name__)


def stream_split_stories_csv(user_mc_key, filename, item_id, which):
    response = {
        'story_splits': apicache.split_story_count(user_mc_key, [which + ":" + str(item_id)])['counts']
    }
    clean_results = [{'date': trimSolrDate(item['date']), 'numStories': item['count']} for item in response['story_splits']]
    clean_results = sorted(clean_results, key=itemgetter('date'))
    props = ['date', 'numStories']
    return csv.stream_response(clean_results, props, filename)


