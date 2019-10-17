import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

// pass in the topicId
export const FETCH_PLATFORMS = 'FETCH_PLATFORMS';
export const fetchTopicPlatforms = createAsyncAction(FETCH_PLATFORMS, api.topicPlatformList);

export const EDIT_PLATFORM = 'EDIT_PLATFORM';
export const editTopicPlatform = createAsyncAction(EDIT_PLATFORM, api.topicEditPlatform);

export const DELETE_PLATFORM = 'DELETE_PLATFORM';
export const deleteTopicPlatform = createAsyncAction(DELETE_PLATFORM, api.topicDeletePlatform);

export const FETCH_CREATE_OPEN_WEB_PLATFORM = 'FETCH_CREATE_OPEN_WEB_PLATFORM';
export const fetchCreateOpenWebPlatform = createAsyncAction(FETCH_CREATE_OPEN_WEB_PLATFORM, api.topicCreateOpenWebPlatform);

export const FETCH_CREATE_TWITTER_PLATFORM = 'FETCH_CREATE_TWITTER_PLATFORM';
export const fetchCreateTwitterPlatform = createAsyncAction(FETCH_CREATE_TWITTER_PLATFORM, api.topicCreateTwitterPlatform);

export const FETCH_CREATE_REDDIT_PLATFORM = 'FETCH_CREATE_REDDIT_PLATFORM';
export const fetchCreateRedditPlatform = createAsyncAction(FETCH_CREATE_REDDIT_PLATFORM, api.topicCreateRedditPlatform);
