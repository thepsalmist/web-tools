import { FETCH_CREATE_OPEN_WEB_STORY_COUNTS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const openWebTotals = createAsyncReducer({
  initialState: {
    counts: null,
  },
  action: FETCH_CREATE_OPEN_WEB_STORY_COUNTS,
});

export default openWebTotals;
