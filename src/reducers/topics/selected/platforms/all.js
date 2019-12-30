import { FETCH_PLATFORMS_IN_TOPIC, RESET_PLATFORMS/* FETCH_ALL_PLATFORMS */ }
  from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    results: [],
  },
  action: FETCH_PLATFORMS_IN_TOPIC,
  [RESET_PLATFORMS]: () => ({ results: [] }),
});

export default all;
