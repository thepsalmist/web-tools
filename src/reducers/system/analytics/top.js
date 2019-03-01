import { FETCH_TOP_ANALYTICS_RESULTS } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const top = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_TOP_ANALYTICS_RESULTS,
});

export default top;
