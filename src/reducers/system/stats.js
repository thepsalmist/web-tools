import { FETCH_SYSTEM_STATS } from '../../actions/systemActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const stats = createAsyncReducer({
  initialState: {
    object: null,
    stats: {
      total_stories: undefined,
    },
  },
  action: FETCH_SYSTEM_STATS,
});

export default stats;
