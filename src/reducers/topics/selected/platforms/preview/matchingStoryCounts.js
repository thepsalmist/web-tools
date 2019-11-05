import { FETCH_PLATFORM_PREVIEW_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const storyTotals = createAsyncReducer({
  initialState: {
    count: null,
    total: 0,
  },
  action: FETCH_PLATFORM_PREVIEW_STORY_COUNTS,
});

export default storyTotals;
