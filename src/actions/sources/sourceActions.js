import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/sources';

export const FETCH_SOURCE_LIST = 'FETCH_SOURCE_LIST';
export const FETCH_SOURCES_BY_IDS = 'FETCH_SOURCES_BY_IDS';
export const RESET_SOURCES_BY_IDS = 'RESET_SOURCES_BY_IDS';
export const FETCH_SOURCE_DETAILS = 'FETCH_SOURCE_DETAILS';
export const SELECT_SOURCE = 'SELECT_SOURCE';
export const FETCH_SOURCE_TOP_WORDS = 'FETCH_SOURCE_TOP_WORDS';
export const FETCH_SOURCE_SPLIT_STORY_COUNT = 'FETCH_SOURCE_SPLIT_STORY_COUNT';
export const FETCH_SOURCE_GEO = 'FETCH_SOURCE_GEO';
export const CREATE_NEW_SOURCE = 'CREATE_NEW_SOURCE';
export const UPDATE_SOURCE = 'UPDATE_SOURCE';
export const SCRAPE_SOURCE_FEEDS = 'SCRAPE_SOURCE_FEEDS';
export const FETCH_SOURCE_STATS = 'FETCH_SOURCE_STATS';
export const FETCH_SOURCE_WITH_NAME_EXISTS = 'FETCH_SOURCE_WITH_NAME_EXISTS';

export const selectSource = createAction(SELECT_SOURCE, id => id);

export const fetchSourceList = createAsyncAction(FETCH_SOURCE_LIST, api.sourceList);

export const fetchSourcesByIds = createAsyncAction(FETCH_SOURCES_BY_IDS, api.sourcesByIds, props => props);

export const resetSourcesByIds = createAction(RESET_SOURCES_BY_IDS);

export const fetchSourceDetails = createAsyncAction(FETCH_SOURCE_DETAILS, api.sourceDetails, id => id);

export const fetchSourceSplitStoryCount = createAsyncAction(FETCH_SOURCE_SPLIT_STORY_COUNT, api.sourceSplitStoryCount, props => props);

export const fetchSourceTopWords = createAsyncAction(FETCH_SOURCE_TOP_WORDS, api.sourceWordCount, id => id);

export const fetchSourceGeo = createAsyncAction(FETCH_SOURCE_GEO, api.sourceGeography, id => id);

export const createSource = createAsyncAction(CREATE_NEW_SOURCE, api.createSource);

export const updateSource = createAsyncAction(UPDATE_SOURCE, api.updateSource, props => props);

export const scrapeSourceFeeds = createAsyncAction(SCRAPE_SOURCE_FEEDS, api.scrapeSourceFeeds, id => id);

export const fetchSourceStats = createAsyncAction(FETCH_SOURCE_STATS, api.fetchSourceStats, id => id);

export const fetchSourceWithNameExists = createAsyncAction(FETCH_SOURCE_WITH_NAME_EXISTS, api.fetchSourceWithNameExists, searchStr => searchStr);
