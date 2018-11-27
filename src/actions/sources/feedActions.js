import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/sources';

export const FETCH_SOURCE_FEEDS = 'FETCH_SOURCE_FEEDS';
export const fetchSourceFeeds = createAsyncAction(FETCH_SOURCE_FEEDS, api.sourceFeeds, id => id);

export const FETCH_SOURCE_FEED = 'FETCH_SOURCE_FEED';
export const fetchSourceFeed = createAsyncAction(FETCH_SOURCE_FEED, api.sourceFeed, id => id);

export const SELECT_SOURCE_FEED = 'SELECT_SOURCE_FEED';
export const selectSourceFeed = createAction(SELECT_SOURCE_FEED, id => id);

export const CREATE_FEED = 'CREATE_FEED';
export const createFeed = createAsyncAction(CREATE_FEED, api.createFeed, id => id);

export const UPDATE_FEED = 'UPDATE_FEED';
export const updateFeed = createAsyncAction(UPDATE_FEED, api.updateFeed, id => id);

export const FETCH_FEED_RECENT_STORIES = 'FETCH_FEED_RECENT_STORIES';
export const fetchSourceFeedRecentStories = createAsyncAction(FETCH_FEED_RECENT_STORIES, api.sourceFeedRecentStories, id => id);
