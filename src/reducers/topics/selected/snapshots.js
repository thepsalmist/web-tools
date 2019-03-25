import { resolve } from 'redux-simple-promise';
import { FETCH_TOPIC_SNAPSHOTS_LIST, TOPIC_FILTER_BY_SNAPSHOT, FETCH_TOPIC_SUMMARY }
  from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import { snapshotDateToMoment } from '../../../lib/dateUtil';
import { parseId } from '../../../lib/numberUtil';

export const TOPIC_SNAPSHOT_STATE_QUEUED = 'queued';
export const TOPIC_SNAPSHOT_STATE_RUNNING = 'running';
export const TOPIC_SNAPSHOT_STATE_COMPLETED = 'completed';
export const TOPIC_SNAPSHOT_STATE_ERROR = 'error';
// catch an error state that is happening but we don't know why yet!
export const TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED = 'created but not queued';

export const snapshotIsUsable = s => (s.state === TOPIC_SNAPSHOT_STATE_COMPLETED) && (s.searchable === true);

export function latestUsableSnapshot(snapshots) {
  const usableSnapshots = snapshots.filter(s => snapshotIsUsable(s)).sort((f1, f2) => {
    if (f1.snapshot_date < f2.snapshot_date) {
      return 1;
    }
    return -1;
  });
  if (usableSnapshots.length > 0) {
    return usableSnapshots[0];
  }
  return null;
}

function getSnapshotFromListById(list, id) {
  const result = list.find(element => element.snapshots_id === id);
  return (result === undefined) ? null : result;
}

function cleanUpSnapshotList(rawList, jobList) {
  return rawList.map(s => ({
    ...s,
    snapshotJobs: jobList.filter(job => s.snapshots_id === job.snapshots_id),
    snapshotDate: snapshotDateToMoment(s.snapshot_date),
    isUsable: snapshotIsUsable(s),
  }));
}

function isLatestVersionRunning(rawList) {
  if (rawList.length === 0) {
    return false;
  }
  const latestSnapshot = rawList[0];
  return (latestSnapshot.state === 'running')
    || ((latestSnapshot.state === 'completed') && (latestSnapshot.searchable === 0));
}

const snapshotsByDateDesc = list => list.sort((f1, f2) => {
  if (f1.snapshot_date < f2.snapshot_date) {
    return 1;
  }
  return -1;
});

const latestByDate = (list) => {
  const orderedList = snapshotsByDateDesc(list);
  if (orderedList && orderedList.length > 0) {
    return orderedList[0];
  }
  return null;
};

const usingLatestSnapshot = (list, selectedId) => {
  const latest = latestByDate(list);
  if (latest) {
    return selectedId === latest.snapshots_id;
  }
  return false;
};

const snapshots = createAsyncReducer({
  initialState: {
    list: [],
    jobStatus: [],
    latest: null,
    usingLatest: false,
    latestUsableSnapshot: null,
    latestVersionRunning: false,
    selectedId: null,
    selected: null,
  },
  action: FETCH_TOPIC_SNAPSHOTS_LIST,
  handleSuccess: (payload, state) => {
    const snapshotList = cleanUpSnapshotList(payload.snapshots.list, payload.snapshots.jobStatus);
    return {
      // add in an isUsable property to centralize that logic to one place (ie. here!)
      list: snapshotList,
      jobStatus: payload.jobStatus, // DEPRECATED
      latest: latestByDate(payload.snapshots.list),
      usingLatest: usingLatestSnapshot(payload.snapshots.list, state.selectedId),
      latestUsableSnapshot: latestUsableSnapshot(snapshotList),
      latestVersionRunning: isLatestVersionRunning(payload.snapshots.list),
      selected: getSnapshotFromListById(snapshotList, state.selectedId),
    };
  },
  [resolve(FETCH_TOPIC_SUMMARY)]: (payload, state) => ({ // topic summary includes list of snapshots
    list: cleanUpSnapshotList(payload.snapshots.list, payload.snapshots.jobStatus),
    jobStatus: payload.snapshots.jobStatus, // DEPRECATED
    latest: latestByDate(payload.snapshots.list),
    usingLatest: usingLatestSnapshot(payload.snapshots.list, state.selectedId),
    latestUsableSnapshot: latestUsableSnapshot(payload.snapshots.list),
    latestVersionRunning: isLatestVersionRunning(payload.snapshots.list),
  }),
  [TOPIC_FILTER_BY_SNAPSHOT]: (payload, state) => ({
    selectedId: parseId(payload),
    usingLatest: usingLatestSnapshot(state.list, parseId(payload)),
    selected: getSnapshotFromListById(state.list, parseId(payload)),
  }),
});

export default snapshots;
