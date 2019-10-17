import { FETCH_PLATFORMS }
  from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const all = createAsyncReducer({
  initialState: {
    list: {},
  },
  action: FETCH_PLATFORMS,
});

export default all;
