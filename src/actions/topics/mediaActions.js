import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_TOP_MEDIA = 'FETCH_TOPIC_TOP_MEDIA';
export const SORT_TOPIC_TOP_MEDIA = 'SORT_TOPIC_TOP_MEDIA';
export const FETCH_TOPIC_INFLUENTIAL_MEDIA = 'FETCH_TOPIC_INFLUENTIAL_MEDIA';
export const SORT_TOPIC_INFLUENTIAL_MEDIA = 'SORT_TOPIC_INFLUENTIAL_MEDIA';
export const SELECT_MEDIA = 'SELECT_MEDIA';
export const FETCH_MEDIA = 'FETCH_MEDIA';
export const FETCH_MEDIA_SPLIT_STORY_COUNT = 'FETCH_MEDIA_SPLIT_STORY_COUNT';

// pass in topicId, snapshotId, timespanId, sort, limit
export const fetchTopicTopMedia = createAsyncAction(FETCH_TOPIC_TOP_MEDIA, api.topicTopMedia);

// pass in sort
export const sortTopicTopMedia = createAction(SORT_TOPIC_TOP_MEDIA, sort => sort);

// pass in topicId, snapshotId, timespanId, sort, limit, linkId
export const fetchTopicInfluentialMedia = createAsyncAction(FETCH_TOPIC_INFLUENTIAL_MEDIA, api.topicTopMedia);

// pass in sort
export const sortTopicInfluentialMedia = createAction(SORT_TOPIC_INFLUENTIAL_MEDIA, sort => sort);

// pass in media id
export const selectMedia = createAction(SELECT_MEDIA, id => id);

// pass in topic id, media id, filters
export const fetchMedia = createAsyncAction(FETCH_MEDIA, api.media);

// pass in topic id, media id, snapshot id, timespan id
export const fetchMediaSplitStoryCounts = createAsyncAction(FETCH_MEDIA_SPLIT_STORY_COUNT, api.mediaSplitStoryCounts);
