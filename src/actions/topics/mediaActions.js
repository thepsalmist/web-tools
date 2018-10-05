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
export const FETCH_MEDIA_STORIES = 'FETCH_MEDIA_STORIES';
export const SORT_MEDIA_STORIES = 'SORT_MEDIA_STORIES';
export const FETCH_MEDIA_INLINKS = 'FETCH_MEDIA_INLINKS';
export const FETCH_ALL_MEDIA_INLINKS = 'FETCH_ALL_MEDIA_INLINKS';
export const SORT_MEDIA_INLINKS = 'SORT_MEDIA_INLINKS';
export const FETCH_MEDIA_OUTLINKS = 'FETCH_MEDIA_OUTLINKS';
export const FETCH_ALL_MEDIA_OUTLINKS = 'FETCH_ALL_MEDIA_OUTLINKS';
export const SORT_MEDIA_OUTLINKS = 'SORT_MEDIA_OUTLINKS';
export const FETCH_MEDIA_WORDS = 'FETCH_MEDIA_WORDS';

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

// pass in topic id, media id, snapshot id, timespan id, sort, limit
export const fetchMediaStories = createAsyncAction(FETCH_MEDIA_STORIES, api.mediaStories);

// pass in sort
export const sortMediaStories = createAction(SORT_MEDIA_STORIES, sort => sort);

// pass in topic id, media id, snapshot id, timespan id, sort, limit
export const fetchMediaInlinks = createAsyncAction(FETCH_MEDIA_INLINKS, api.mediaInlinks);

export const fetchAllMediaInlinks = createAsyncAction(FETCH_ALL_MEDIA_INLINKS, api.allMediaInlinks);

// pass in sort
export const sortMediaInlinks = createAction(SORT_MEDIA_INLINKS, sort => sort);

// pass in topic id, media id, snapshot id, timespan id, sort, limit
export const fetchMediaOutlinks = createAsyncAction(FETCH_MEDIA_OUTLINKS, api.mediaOutlinks);

export const fetchAllMediaOutlinks = createAsyncAction(FETCH_ALL_MEDIA_OUTLINKS, api.allMediaOutlinks);


// pass in sort
export const sortMediaOutlinks = createAction(SORT_MEDIA_OUTLINKS, sort => sort);

// pass in topic id, media id, snapshot id, timespan id
export const fetchMediaWords = createAsyncAction(FETCH_MEDIA_WORDS, api.mediaWords);
