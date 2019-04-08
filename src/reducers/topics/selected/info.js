import { FETCH_TOPIC_SUMMARY } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

// this is important to handle the fact that some older topics don't have any snapshots
// but do have jobs
export const addLatestStateToTopic = (t) => {
  let latestState;
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
  };
};

const info = createAsyncReducer({
  action: FETCH_TOPIC_SUMMARY,
  handleSuccess: payload => ({ ...addLatestStateToTopic(payload) }),
  UPDATE_TOPIC_RESOLVED: payload => ({ ...payload }),
  SET_TOPIC_FAVORITE_RESOLVED: payload => ({
    // changing fav status returns full topic info, so update it here
    ...payload,
  }),
});

export default info;
