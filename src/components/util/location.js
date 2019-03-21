import { parseId } from '../../lib/numberUtil';

export function pagedAndSortedLocation(location, linkId, sort, newFilters) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
      sort,
      ...newFilters,
    },
  });
}

export function pagedLocation(location, linkId) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      linkId,
    },
  });
}

export function filteredLocation(location, filters) {
  return Object.assign({}, location, {
    query: {
      ...location.query,
      ...filters,
    },
  });
}

export function filteredLinkTo(to, filters) {
  let query;
  // don't add filters if there are none
  if (filters.snapshotId || parseId(filters.timespanId) || parseId(filters.focusId) || filters.q) {
    query = {
      snapshotId: parseId(filters.snapshotId),
      timespanId: parseId(filters.timespanId),
      focusId: parseId(filters.focusId),
      q: filters.q,
    };
  }
  return { pathname: to, query };
}

export function combineQueryParams(filterQ, query) {
  if (filterQ !== null) {
    return `${filterQ} AND ${query}`;
  }
  return query;
}

export function filtersAsUrlParams(filters) {
  return `snapshotId=${filters.snapshotId}&timespanId=${filters.timespanId || ''}&focusId=${filters.focusId || ''}&q=${filters.q || ''}`;
}

export function urlWithFilters(to, filters) {
  return `#${to}?${filtersAsUrlParams(filters)}`;
}
