import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/system';

export const FETCH_FAVORITE_COLLECTIONS = 'FETCH_FAVORITE_COLLECTIONS';
export const FETCH_FAVORITE_SOURCES = 'FETCH_FAVORITE_SOURCES';
export const SET_FAVORITE_SOURCE = 'SET_FAVORITE_SOURCE';
export const SET_FAVORITE_COLLECTION = 'SET_FAVORITE_COLLECTION';

export const favoriteSource = createAsyncAction(SET_FAVORITE_SOURCE, api.favoriteSource);

export const fetchFavoriteCollections = createAsyncAction(FETCH_FAVORITE_COLLECTIONS, api.fetchFavoriteCollections);

export const fetchFavoriteSources = createAsyncAction(FETCH_FAVORITE_SOURCES, api.fetchFavoriteSources);

export const favoriteCollection = createAsyncAction(SET_FAVORITE_COLLECTION, api.favoriteCollection);
