import { createApiPromise, acceptParams } from '../apiUtil';

const FILTER_PARAMS = ['snapshotId', 'focusId', 'timespanId', 'q'];

export function topicProviderWords(topicId, params) {
  const acceptedParams = acceptParams(params, [...FILTER_PARAMS, 'sampleSize', 'ngramSize', 'withOverall']);
  return createApiPromise(`/api/topics/${topicId}/provider/words`, acceptedParams);
}

export const temp = 'temp';
