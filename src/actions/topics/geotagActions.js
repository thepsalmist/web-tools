import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_GEOCODED_STORY_COUNTS = 'FETCH_TOPIC_GEOCODED_STORY_COUNTS';

// pass in topic id, filters
export const fetchTopicGeocodedStoryCounts = createAsyncAction(FETCH_TOPIC_GEOCODED_STORY_COUNTS, api.topicGeocodedStoryCounts);
