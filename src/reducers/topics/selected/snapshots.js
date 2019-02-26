import { FETCH_TOPIC_SNAPSHOTS_LIST } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import { snapshotDateToMoment } from '../../../lib/dateUtil';

export const TOPIC_SNAPSHOT_STATE_QUEUED = 'queued';
export const TOPIC_SNAPSHOT_STATE_RUNNING = 'running';
export const TOPIC_SNAPSHOT_STATE_COMPLETED = 'completed';
export const TOPIC_SNAPSHOT_STATE_ERROR = 'error';
// catch an error state that is happening but we don't know why yet!
export const TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED = 'created but not queued';

export const snapshotIsUsable = s => (s.state === TOPIC_SNAPSHOT_STATE_COMPLETED) && (s.searchable === true);

const snapshots = createAsyncReducer({
  initialState: {
    list: [],
    jobStatus: [],
    currentVersion: null,
  },
  action: FETCH_TOPIC_SNAPSHOTS_LIST,
  FETCH_TOPIC_SUMMARY_RESOLVED: payload => ({ // topic summary includes list of snapshots
    list: payload.snapshots.list.map(s => ({
      ...s,
      snapshotDate: snapshotDateToMoment(s.snapshot_date),
      isUsable: snapshotIsUsable(s),
    })),
    jobStatus: payload.snapshots.jobStatus,
    currentVersion: payload.snapshots.currentVersion,
  }),
  handleSuccess: payload => ({
    // add in an isUsable property to centralize that logic to one place (ie. here!)
    list: payload.list.map(s => ({
      ...s,
      snapshotDate: snapshotDateToMoment(s.snapshot_date),
      isUsable: snapshotIsUsable(s),
    })),
    jobStatus: payload.jobStatus,
    currentVersion: payload.snapshots.currentVersion,
  }),
});

export default snapshots;
