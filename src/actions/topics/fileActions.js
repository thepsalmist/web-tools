import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

// pass in topic id & params (snapshot id, focus id, timespan id)
export const FETCH_TOPIC_MAP_FILES = 'FETCH_TOPIC_MAP_FILES';
export const fetchTopicMapFiles = createAsyncAction(FETCH_TOPIC_MAP_FILES, api.topicMapFiles);

// pass in topic id & params (snapshot id, focus id, timespan id)
export const FETCH_TOPIC_TIMESPAN_FILES = 'FETCH_TOPIC_TIMESPAN_FILES';
export const fetchTopicTimespanFiles = createAsyncAction(FETCH_TOPIC_TIMESPAN_FILES, api.topicTimespanFiles);
