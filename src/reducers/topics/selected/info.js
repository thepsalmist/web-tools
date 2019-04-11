import { resolve } from 'redux-simple-promise';
import { FETCH_TOPIC_SUMMARY, UPDATE_TOPIC_SEED_QUERY, UPDATE_TOPIC_SETTINGS, SET_TOPIC_FAVORITE } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const addVersionNumberToJobs = (snapshots, jobStates) => {
  let newJobStates;
  if (snapshots) {
    newJobStates = jobStates.map((j) => {
      const associatedSnapshot = snapshots.find(s => s.snapshots_id === j.snapshots_id);
      const versionNumber = associatedSnapshot ? associatedSnapshot.note : null;
      return { ...j, versionNumber };
    });
  } else {
    newJobStates = jobStates;
  }
  return newJobStates;
};

// this is important to handle the fact that some older topics don't have any snapshots
// but do have jobs
export const addLatestStateToTopic = (t) => {
  let latestState; // this acts as a psuedo-snapshot
  // if no jobs, use original topic state
  if (t.job_states.length === 0) {
    latestState = {
      state: t.state,
      message: null,
      job_states_id: null,
    };
  } else {
    // if jobs, determine the latest
    const mostRecentJobState = t.job_states[0];
    latestState = {
      state: mostRecentJobState.state,
      message: mostRecentJobState.message,
      job_states_id: mostRecentJobState.job_states_id,
    };
  }
  return {
    ...t,
    latestState,
    job_states: t.snapshots ? addVersionNumberToJobs(t.snapshots.list, t.job_states) : [],
  };
};

const info = createAsyncReducer({
  action: FETCH_TOPIC_SUMMARY,
  handleSuccess: payload => ({ ...addLatestStateToTopic(payload) }),
  [resolve(UPDATE_TOPIC_SEED_QUERY)]: payload => ({ ...addLatestStateToTopic(payload) }),
  [resolve(UPDATE_TOPIC_SETTINGS)]: payload => ({ ...addLatestStateToTopic(payload) }),
  // changing fav status returns full topic info, so update it here
  [resolve(SET_TOPIC_FAVORITE)]: payload => ({ ...payload })({ ...addLatestStateToTopic(payload) }),
});

export default info;
