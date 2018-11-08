import { FETCH_TOPIC_STORY_COUNTS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const storyTotals = createAsyncReducer({
  initialState: {
    counts: {},
  },
  action: FETCH_TOPIC_STORY_COUNTS,
});

export default storyTotals;
