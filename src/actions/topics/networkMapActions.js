import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

// pass in topic id & params (snapshot id, focus id, timespan id)
export const FETCH_TOPIC_MAP_FILES = 'FETCH_TOPIC_MAP_FILES';
export const fetchTopicMapFiles = createAsyncAction(FETCH_TOPIC_MAP_FILES, api.topicMapFiles);

// pass in topic id & timespan_maps_id
export const FETCH_TOPIC_MEDIA_MAP_FILE = 'FETCH_TOPIC_MEDIA_MAP_FILE';
export const fetchTopicMediaMapFile = createAsyncAction(FETCH_TOPIC_MEDIA_MAP_FILE, api.topicMediaMapFile);
