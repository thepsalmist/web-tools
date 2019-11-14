import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const GO_TO_CREATE_PLATFORM_STEP = 'GO_TO_CREATE_PLATFORM_STEP';
export const goToCreatePlatformStep = createAction(GO_TO_CREATE_PLATFORM_STEP, step => step);
// pass in the topicId
export const FETCH_ALL_PLATFORMS = 'FETCH_ALL_PLATFORMS';
export const fetchTopicPlatforms = createAsyncAction(FETCH_ALL_PLATFORMS, api.topicPlatformList);

export const FETCH_PLATFORMS_IN_TOPIC = 'FETCH_PLATFORMS_IN_TOPIC';
export const fetchPlatformsInTopicList = createAsyncAction(FETCH_PLATFORMS_IN_TOPIC, api.platformsInTopic);

export const FETCH_TOPIC_PLATFORM_BY_ID = 'FETCH_TOPIC_PLATFORM_BY_ID';
export const fetchTopicPlatformById = createAsyncAction(FETCH_TOPIC_PLATFORM_BY_ID, api.topicFetchPlatformById);


export const DELETE_PLATFORM = 'DELETE_PLATFORM';
export const deleteTopicPlatform = createAsyncAction(DELETE_PLATFORM, api.topicDeletePlatform);

export const TOPIC_CREATE_PLATFORM = 'TOPIC_CREATE_PLATFORM';
export const topicCreatePlatform = createAsyncAction(TOPIC_CREATE_PLATFORM, api.topicCreatePlatform, params => params);

export const TOPIC_UPDATE_PLATFORM = 'TOPIC_UPDATE_PLATFORM';
export const topicUpdatePlatform = createAsyncAction(TOPIC_UPDATE_PLATFORM, api.topicUpdatePlatform, params => params);

export const SELECT_PLATFORM = 'SELECT_PLATFORM';
export const selectPlatform = createAsyncAction(SELECT_PLATFORM, platform => platform);

export const FETCH_PLATFORM_PREVIEW_STORY_COUNTS = 'FETCH_PLATFORM_PREVIEW_STORY_COUNTS';
export const fetchStoryCountsByPlatformQuery = createAsyncAction(FETCH_PLATFORM_PREVIEW_STORY_COUNTS, api.topicStoryCountsByPlatformQuery);

export const FETCH_PLATFORM_PREVIEW_STORIES = 'FETCH_PLATFORM_PREVIEW_STORIES';
export const fetchStoriesByPlatformQuery = createAsyncAction(FETCH_PLATFORM_PREVIEW_STORIES, api.topicStoriesByPlatformQuery);
