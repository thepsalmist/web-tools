import { FETCH_PLATFORMS_IN_TOPIC /* FETCH_ALL_PLATFORMS */ }
  from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    results: [],
  },
  action: FETCH_PLATFORMS_IN_TOPIC, // TODO which reducer
});

export default all;
