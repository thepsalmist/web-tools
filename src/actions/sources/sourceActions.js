import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/sources';

export const SELECT_SOURCE = 'SELECT_SOURCE';
export const selectSource = createAction(SELECT_SOURCE, id => id);

export const FETCH_SOURCES_BY_IDS = 'FETCH_SOURCES_BY_IDS';
export const fetchSourcesByIds = createAsyncAction(FETCH_SOURCES_BY_IDS, api.sourcesByIds, props => props);

export const FETCH_SOURCE_DETAILS = 'FETCH_SOURCE_DETAILS';
export const fetchSourceDetails = createAsyncAction(FETCH_SOURCE_DETAILS, api.sourceDetails, id => id);

export const UPDATE_SOURCE = 'UPDATE_SOURCE';
export const updateSource = createAsyncAction(UPDATE_SOURCE, api.updateSource, props => props);

export const SCRAPE_SOURCE_FEEDS = 'SCRAPE_SOURCE_FEEDS';
export const scrapeSourceFeeds = createAsyncAction(SCRAPE_SOURCE_FEEDS, api.scrapeSourceFeeds, id => id);

export const FETCH_SOURCE_STATS = 'FETCH_SOURCE_STATS';
export const fetchSourceStats = createAsyncAction(FETCH_SOURCE_STATS, api.fetchSourceStats, id => id);

export const FETCH_SOURCE_WITH_NAME_EXISTS = 'FETCH_SOURCE_WITH_NAME_EXISTS';
export const fetchSourceWithNameExists = createAsyncAction(FETCH_SOURCE_WITH_NAME_EXISTS, api.fetchSourceWithNameExists, searchStr => searchStr);

export const FETCH_SOURCE_REVIEW_INFO = 'FETCH_SOURCE_REVIEW_INFO';
export const fetchSourceReviewInfo = createAsyncAction(FETCH_SOURCE_REVIEW_INFO, api.fetchSourceReviewInfo, id => id);

export const CREATE_NEW_SOURCE = 'CREATE_NEW_SOURCE';
export const createSource = createAsyncAction(CREATE_NEW_SOURCE, api.createSource);

export const DISCOVER_SOURCE_SITEMAPS = 'DISCOVER_SOURCE_SITEMAPS';
export const discoverSourceSitemaps = createAsyncAction(DISCOVER_SOURCE_SITEMAPS, api.discoverSourceSitemaps);

export const ABANDON_PREVIEW_SOURCE_SITEMAPS = 'ABANDON_PREVIEW_SOURCE_SITEMAPS';
export const abandonPreviewSourceSitemaps = createAsyncAction(ABANDON_PREVIEW_SOURCE_SITEMAPS, api.sourceSitemapsPreviewAbandon);

export const RETRY_PREVIEW_SOURCE_SITEMAPS = 'RETRY_PREVIEW_SOURCE_SITEMAPS';
export const retryPreviewSourceSitemaps = createAsyncAction(ABANDON_PREVIEW_SOURCE_SITEMAPS, api.sourceSitemapsPreviewRetry);

export const CANCEL_PREVIEW_SOURCE_SITEMAPS = 'CANCEL_PREVIEW_SOURCE_SITEMAPS';
export const cancelPreviewSourceSitemaps = createAsyncAction(ABANDON_PREVIEW_SOURCE_SITEMAPS, api.sourceSitemapsPreviewCancel);

export const APPROVE_PREVIEW_SOURCE_SITEMAPS = 'APPROVE_PREVIEW_SOURCE_SITEMAPS';
export const approvePreviewSourceSitemaps = createAsyncAction(ABANDON_PREVIEW_SOURCE_SITEMAPS, api.sourceSitemapsPreviewApprove);

export const REJECT_PREVIEW_SOURCE_SITEMAPS = 'REJECT_PREVIEW_SOURCE_SITEMAPS';
export const rejectPreviewSourceSitemaps = createAsyncAction(ABANDON_PREVIEW_SOURCE_SITEMAPS, api.sourceSitemapsPreviewReject);

export const DOWNLOAD_PREVIEW_SOURCE_SITEMAPS = 'DOWNLOAD_PREVIEW_SOURCE_SITEMAPS';
export const downloadPreviewSourceSitemaps = createAsyncAction(ABANDON_PREVIEW_SOURCE_SITEMAPS, api.sourceSitemapsPreviewDownload);
