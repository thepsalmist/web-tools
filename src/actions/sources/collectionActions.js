import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/sources';

export const FETCH_FEATURED_COLLECTIONS_LIST = 'FETCH_FEATURED_COLLECTIONS_LIST';
export const FETCH_COLLECTION_TOP_WORDS = 'FETCH_COLLECTION_TOP_WORDS';
export const FETCH_COLLECTION_SPLIT_STORY_COUNT = 'FETCH_COLLECTION_SPLIT_STORY_COUNT';
export const FETCH_COLLECTION_GEO = 'FETCH_COLLECTION_GEO';
export const FETCH_COLLECTION_SOURCE_REPRESENTATION = 'FETCH_COLLECTION_SOURCE_REPRESENTATION';
export const FETCH_COLLECTION_SOURCE_SPLIT_STORY_HISTORICAL_COUNTS = 'FETCH_COLLECTION_SOURCE_SPLIT_STORY_HISTORICAL_COUNTS';
export const SET_COLLECTION_SOURCE_HISTORY_TIME_PERIOD = 'SET_COLLECTION_SOURCE_HISTORY_TIME_PERIOD';
export const FETCH_SIMILAR_COLLECTIONS = 'FETCH_SIMILAR_COLLECTIONS';
export const FETCH_COLLECTION_LIST = 'FETCH_COLLECTION_LIST';
export const FETCH_COLLECTION_DETAILS = 'FETCH_COLLECTION_DETAILS';
export const SELECT_COLLECTION = 'SELECT_COLLECTION';
export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const FETCH_COLLECTION_TO_COPY = 'FETCH_COLLECTION_TO_COPY';
export const CREATE_NEW_COLLECTION = 'CREATE_NEW_COLLECTION';
export const FETCH_COLLECTION_SOURCES_BY_IDS = 'FETCH_COLLECTION_SOURCES_BY_IDS';
export const RESET_COLLECTIONS_BY_IDS = 'RESET_COLLECTIONS_BY_IDS';
export const UPLOAD_SOURCE_LIST_FROM_TEMPLATE = 'UPLOAD_SOURCE_LIST_FROM_TEMPLATE';
export const CREATE_SOURCES_FROM_URLS = 'CREATE_SOURCES_FROM_URLS';
export const FETCH_COLLECTION_SOURCE_LIST = 'FETCH_COLLECTION_SOURCE_LIST';

export const fetchCollectionSourcesByIds = createAsyncAction(FETCH_COLLECTION_SOURCES_BY_IDS, api.collectionsByIds, props => props);

export const resetCollectionsByIds = createAction(RESET_COLLECTIONS_BY_IDS);

export const selectCollection = createAction(SELECT_COLLECTION, id => id);

export const fetchCollectionList = createAsyncAction(FETCH_COLLECTION_LIST, api.collectionList, id => id);

export const fetchCollectionDetails = createAsyncAction(FETCH_COLLECTION_DETAILS, api.collectionDetails, id => id);

export const fetchCollectionToCopy = createAsyncAction(FETCH_COLLECTION_TO_COPY, api.collectionDetails, id => id);

export const fetchCollectionSplitStoryCount = createAsyncAction(FETCH_COLLECTION_SPLIT_STORY_COUNT, api.collectionSplitStoryCount, id => id);

export const fetchCollectionTopWords = createAsyncAction(FETCH_COLLECTION_TOP_WORDS, api.collectionWordCount, id => id);

export const fetchCollectionGeo = createAsyncAction(FETCH_COLLECTION_GEO, api.collectionGeography, id => id);

export const fetchCollectionSourceRepresentation = createAsyncAction(FETCH_COLLECTION_SOURCE_REPRESENTATION, api.collectionSourceRepresentation, id => id);

export const fetchCollectionSourceSplitStoryHistoricalCounts = createAsyncAction(FETCH_COLLECTION_SOURCE_SPLIT_STORY_HISTORICAL_COUNTS, api.collectionSourceSplitStoryHistoricalCounts, id => id);

export const fetchCollectionSourceList = createAsyncAction(FETCH_COLLECTION_SOURCE_LIST, api.collectionSourceList, details => details);

export const setCollectionSourceHistoryTimePeriod = createAction(SET_COLLECTION_SOURCE_HISTORY_TIME_PERIOD, timePeriod => timePeriod);

export const createCollection = createAsyncAction(CREATE_NEW_COLLECTION, api.createCollection, props => props);

export const updateCollection = createAsyncAction(UPDATE_COLLECTION, api.updateCollection, props => props);

export const fetchSimilarCollections = createAsyncAction(FETCH_SIMILAR_COLLECTIONS, api.similarCollections, id => id);

export const fetchFeaturedCollectionList = createAsyncAction(FETCH_FEATURED_COLLECTIONS_LIST, api.featuredCollectionList);

export const uploadSourceListFromTemplate = createAsyncAction(UPLOAD_SOURCE_LIST_FROM_TEMPLATE, api.collectionUploadSourceListFromTemplate, props => props);

export const createSourcesByUrl = createAsyncAction(CREATE_SOURCES_FROM_URLS, api.createSourcesByUrl, urls => urls);
