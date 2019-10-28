import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';


export const GO_TO_CREATE_PLATFORM_STEP = 'GO_TO_CREATE_PLATFORM_STEP';
export const goToCreatePlatformStep = createAction(GO_TO_CREATE_PLATFORM_STEP, step => step);
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

export const FETCH_CREATE_OPEN_WEB_STORY_COUNTS = 'FETCH_CREATE_OPEN_WEB_STORY_COUNTS';
export const fetchCreateOpenWebStoryCounts = createAsyncAction(FETCH_CREATE_OPEN_WEB_STORY_COUNTS, api.topicCreatePlatformOpenWebStoryCounts);

export const FETCH_CREATE_TWITTER_STORY_COUNTS = 'FETCH_CREATE_TWITTER_STORY_COUNTS';
export const fetchCreateTwitterStoryCounts = createAsyncAction(FETCH_CREATE_TWITTER_STORY_COUNTS, api.topicCreatePlatformTwitterStoryCounts);

export const FETCH_CREATE_REDDIT_STORY_COUNTS = 'FETCH_CREATE_REDDIT_STORY_COUNTS';
export const fetchCreateRedditStoryCounts = createAsyncAction(FETCH_CREATE_REDDIT_STORY_COUNTS, api.topicCreatePlatformRedditStoryCounts);

export const FETCH_CREATE_OPEN_WEB_COVERAGE = 'FETCH_CREATE_OPEN_WEB_COVERAGE';
export const fetchCreateOpenWebCoverage = createAsyncAction(FETCH_CREATE_OPEN_WEB_COVERAGE, api.topicCreatePlatformOpenWebStoryCoverage);

export const FETCH_CREATE_TWITTER_COVERAGE = 'FETCH_CREATE_TWITTER_COVERAGE';
export const fetchCreateTwitterCoverage = createAsyncAction(FETCH_CREATE_TWITTER_COVERAGE, api.topicCreatePlatformTwitterStoryCoverage);

export const FETCH_CREATE_REDDIT_COVERAGE = 'FETCH_CREATE_REDDIT_COVERAGE';
export const fetchCreateRedditCoverage = createAsyncAction(FETCH_CREATE_REDDIT_COVERAGE, api.topicCreatePlatformRedditStoryCoverage);
