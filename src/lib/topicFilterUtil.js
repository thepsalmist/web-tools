import { combineQueryParams } from '../components/util/location';

export const VERSION_ERROR = 'error';
export const VERSION_ERROR_EXCEEDED = 'errorExceededMaxStories';
export const VERSION_CREATING = 'creating';
export const VERSION_QUEUED = 'queuedToRun';
export const VERSION_BUILDING = 'building';
export const VERSION_RUNNING = 'running';
// better desriptors
// const VERSION_RUNNING_SPIDERING = 'runningAndSpidering';
// const VERSION_RUNNING_ERROR = 'runningAndSpideringError';
export const VERSION_READY = 'completed';
export const VERSION_CANCELLED = 'cancelled';
export const VIEW_1K = 1000;


export const TOPIC_PERSONAL = 'personal';

export const TOPIC_PUBLIC = 'public';

export const TOPIC_STARRED = 'favorited';

export function mergeFilters(currentProps, specificQueryFragment) {
  let filterObj = {};
  if (currentProps.filters) {
    filterObj = {
      ...currentProps.filters,
      sample_size: currentProps.sample_size,
      q: combineQueryParams(currentProps.filters.q, specificQueryFragment),
    };
  } else {
    filterObj = {
      sample_size: currentProps.sample_size,
      q: specificQueryFragment,
    };
  }
  return filterObj;
}
