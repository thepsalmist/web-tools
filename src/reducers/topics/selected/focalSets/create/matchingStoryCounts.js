import { FETCH_CREATE_FOCUS_KEYWORD_STORY_COUNTS, FETCH_CREATE_FOCUS_SEARCH_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const storyTotals = createAsyncReducer({
  initialState: {
    counts: null,
  },
  action: FETCH_CREATE_FOCUS_KEYWORD_STORY_COUNTS,
  [FETCH_CREATE_FOCUS_SEARCH_STORY_COUNTS]: payload => {
    const counts = payload;
    return { counts };
  },
});

export default storyTotals;
