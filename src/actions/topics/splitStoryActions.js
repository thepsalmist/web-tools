import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

// pass in topicId, snapshotId, timespanId
export const FETCH_TOPIC_SPLIT_STORY_COUNT = 'FETCH_TOPIC_SPLIT_STORY_COUNT';
export const fetchTopicSplitStoryCounts = createAsyncAction(FETCH_TOPIC_SPLIT_STORY_COUNT, api.topicSplitStoryCounts);

// pass in topicId, focalSetId, filters
export const FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS = 'FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS';
export const fetchTopicFocalSetSplitStoryCounts = createAsyncAction(FETCH_TOPIC_FOCAL_SET_SPLIT_STORY_COUNTS, api.topicFocalSetSplitStoryCounts);

export const FETCH_TOPIC_TOP_STORIES_ON_DATES = 'FETCH_TOPIC_TOP_STORIES_ON_DATES';
export const fetchTopicTopStoriesOnDates = createAsyncAction(FETCH_TOPIC_TOP_STORIES_ON_DATES, api.topicTopStoriesOnDates);
