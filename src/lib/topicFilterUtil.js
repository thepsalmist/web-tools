import { combineQueryParams } from '../components/util/location';

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
