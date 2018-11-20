import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_SPLIT_STORY_COUNT = 'FETCH_TOPIC_SENTENCE_COUNT';
// pass in topicId, snapshotId, timespanId
export const fetchTopicSplitStoryCounts = createAsyncAction(FETCH_TOPIC_SPLIT_STORY_COUNT, api.topicSplitStoryCounts);

export const FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS = 'FETCH_TOPIC_FOCAL_SET_SENTENCE_COUNTS';
// pass in topicId, focalSetId, filters
export const fetchTopicFocalSetSplitStoryCounts = createAsyncAction(FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS, api.topicFocalSetSplitStoryCounts);
