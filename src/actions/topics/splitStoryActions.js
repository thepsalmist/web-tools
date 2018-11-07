import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_SPLIT_STORY_COUNT = 'FETCH_TOPIC_SENTENCE_COUNT';
export const FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS = 'FETCH_TOPIC_FOCAL_SET_SENTENCE_COUNTS';
export const SELECT_TIME_AGGREGATE = 'SELECT_TIME_AGGREGATE';

export const selectTimeAggregatePeriod = createAction(SELECT_TIME_AGGREGATE, timeperiod => timeperiod);

// pass in topicId, snapshotId, timespanId
export const fetchTopicSplitStoryCounts = createAsyncAction(FETCH_TOPIC_SPLIT_STORY_COUNT, api.topicSplitStoryCounts);

// pass in topicId, focalSetId, filters
export const fetchTopicFocalSetSplitStoryCounts = createAsyncAction(FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS, api.topicFocalSetSplitStoryCounts);
