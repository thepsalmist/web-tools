import { createApiPromise, acceptParams } from '../apiUtil';

const FILTER_PARAMS = ['snapshotId', 'focusId', 'timespanId', 'q'];

export function topicProviderWords(topicId, params) {
  const optionalArgs = ['sampleSize', 'ngramSize', 'withOverall'];
  const acceptedParams = acceptParams(params, [...FILTER_PARAMS, ...optionalArgs]);
  return createApiPromise(`/api/topics/${topicId}/provider/words`, acceptedParams);
}

export function topicProviderStories(topicId, params) {
  const optionalArgs = ['linkToMediaId', 'linkFromMediaId', 'linkToStoriesId', 'linkFromStoriesId', 'linkId', 'sort', 'limit', 'uid'];
  const acceptedParams = acceptParams(params, [...FILTER_PARAMS, ...optionalArgs]);
  return createApiPromise(`/api/topics/${topicId}/provider/stories`, acceptedParams);
}
