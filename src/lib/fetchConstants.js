
export const FETCH_INVALID = 'FETCH_INVALID';
export const FETCH_ONGOING = 'FETCH_ONGOING';
export const FETCH_SUCCEEDED = 'FETCH_SUCCEEDED';
export const FETCH_FAILED = 'FETCH_FAILED';

const missingFetchStatusError = {
  msg: 'fetchStatuses is undefined!',
};

function combineArrayOfFetchStatuses(fetchStatusesArray) {
  if (fetchStatusesArray === undefined) {
    throw missingFetchStatusError;
  }
  const allInvalid = fetchStatusesArray.reduce((total, status) => total && (status === FETCH_INVALID), true);
  const anyOngoing = fetchStatusesArray.reduce((total, status) => total || (status === FETCH_ONGOING), false);
  const anyFailed = fetchStatusesArray.reduce((total, status) => total || (status === FETCH_FAILED), false);
  const allSucceeded = fetchStatusesArray.reduce((total, status) => total && (status === FETCH_SUCCEEDED), true);
  if (allInvalid) {
    return FETCH_INVALID;
  }
  if (anyOngoing) {
    return FETCH_ONGOING;
  }
  if (anyFailed) {
    return FETCH_FAILED;
  }
  if (allSucceeded) {
    return FETCH_SUCCEEDED;
  }
  return FETCH_ONGOING;
}

function combineIndexedFetchStatuses(indexedFetchStatuses) {
  if (indexedFetchStatuses === undefined) {
    throw missingFetchStatusError;
  }
  const fetchStatusesArray = Object.keys(indexedFetchStatuses).map(k => indexedFetchStatuses[k]);
  return combineArrayOfFetchStatuses(fetchStatusesArray);
}

// accept a string, an array, or an object
export function combineFetchStatuses(input) {
  let fetchStatusToUse;
  if (input === undefined) {
    throw missingFetchStatusError;
  // support a basic string
  } else if (typeof input === 'string') {
    fetchStatusToUse = input;
  // or an array of strings
  } else if (Array.isArray(input)) {
    fetchStatusToUse = combineArrayOfFetchStatuses(input);
  // or an object keyed to strings
  } else if (typeof input === 'object' && input !== null) {
    fetchStatusToUse = combineIndexedFetchStatuses(input);
  } else {
    const badFetchStatusType = {
      msg: `fetchStatus received is not a valid type - it is ${typeof input}`,
    };
    throw badFetchStatusType;
  }
  return fetchStatusToUse;
}
