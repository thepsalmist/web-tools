import { FETCH_TOPIC_SNAPSHOTS_LIST, TOPIC_FILTER_BY_SNAPSHOT } from '../../../actions/topicActions';
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

function getSnapshotFromListById(list, id) {
  const result = list.find(element => element.snapshots_id === id);
  return (result === undefined) ? null : result;
}

function cleanUpSnapshotList(rawList) {
  return rawList.map(s => ({
    ...s,
    snapshotDate: snapshotDateToMoment(s.snapshot_date),
    isUsable: snapshotIsUsable(s),
  }));
}

const snapshots = createAsyncReducer({
  initialState: {
    list: [],
    jobStatus: [],
    latestVersion: null,
    selectedId: null,
    selected: null,
  },
  action: FETCH_TOPIC_SNAPSHOTS_LIST,
  handleSuccess: (payload, state) => ({
    // add in an isUsable property to centralize that logic to one place (ie. here!)
    list: cleanUpSnapshotList(payload.list),
    jobStatus: payload.jobStatus,
    latestVersion: payload.snapshots.latestVersion,
    selected: getSnapshotFromListById(cleanUpSnapshotList(payload.list), state.selectedId),
  }),
  FETCH_TOPIC_SUMMARY_RESOLVED: payload => ({ // topic summary includes list of snapshots
    list: payload.snapshots.list.map(s => ({
      ...s,
      snapshotDate: snapshotDateToMoment(s.snapshot_date),
      isUsable: snapshotIsUsable(s),
    })),
    jobStatus: payload.snapshots.jobStatus,
    latestVersion: payload.snapshots.latestVersion,
  }),
  [TOPIC_FILTER_BY_SNAPSHOT]: (payload, state) => ({
    selectedId: parseId(payload),
    selected: getSnapshotFromListById(state.list, parseId(payload)),
  }),
});

export default snapshots;
