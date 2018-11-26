import { createApiPromise, createPostingApiPromise, acceptParams } from '../apiUtil';

export function systemStats() {
  return createApiPromise('/api/system-stats');
}

export const TEMP = 'TEMP'; // placeholder to remove stupid lint error


export function fetchMediaPickerFeaturedCollections() {
  // TODO fetch sources too, for now just temp using collections
  return createApiPromise('/api/mediapicker/collections/featured');
}
export function fetchMediaPickerCollections(params) {
  const acceptedParams = acceptParams(params, ['media_keyword', 'which_set']);
  return createApiPromise('/api/mediapicker/collections/search', acceptedParams);
}

export function fetchMediaPickerSources(params) {
  const acceptedParams = acceptParams(params, ['media_keyword', 'tags']);
  return createApiPromise('/api/mediapicker/sources/search', acceptedParams);
}

export function metadataValuesForMediaType(id) {
  return createApiPromise(`/api/metadata/${id}/values`);
}

export function fetchRecentNews() {
  return createApiPromise('/api/release-notes');
}

export function fetchFavoriteSources() {
  return createApiPromise('/api/favorites/sources');
}

export function fetchFavoriteCollections() {
  return createApiPromise('/api/favorites/collections');
}

export function favoriteSource(mediaId, favorite) {
  return createPostingApiPromise(`/api/sources/${mediaId}/favorite`, { favorite: (favorite) ? 1 : 0 });
}

export function favoriteCollection(collectionId, favorite) {
  return createPostingApiPromise(`/api/collections/${collectionId}/favorite`, { favorite: (favorite) ? 1 : 0 }, 'put');
}

export function metadataValuesForCountry(id) {
  return createApiPromise(`api/metadata/${id}/values`);
}

export function metadataValuesForState(id) {
  return createApiPromise(`api/metadata/${id}/values`);
}

export function metadataValuesForPrimaryLanguage(id) {
  return createApiPromise(`api/metadata/${id}/values`);
}

export function metadataValuesForCountryOfFocus(id) {
  return createApiPromise(`api/metadata/${id}/values`);
}

export function sourceSystemSearch(searchStr) {
  return createApiPromise(`/api/sources/search/${searchStr}`);
}

export function fetchSystemUsers() {
  return createApiPromise('/api/admin/users/');
}
