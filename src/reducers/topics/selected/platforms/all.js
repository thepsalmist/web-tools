import { FETCH_PLATFORMS_IN_TOPIC, RESET_PLATFORMS/* FETCH_ALL_PLATFORMS */ }
  from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    results: [],
  },
  action: FETCH_PLATFORMS_IN_TOPIC,
  handleSuccess: payload => ({
    // add in a helpful flag to tell us which of these platforms are actually enabled
    results: payload.results.map(p => ({ ...p, isEnabled: (p.topic_seed_queries_id !== -1) })),
  }),

  [RESET_PLATFORMS]: () => ({ results: [] }),
});

export default all;
