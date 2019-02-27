import { FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const storyTotals = createAsyncReducer({
  initialState: {
    count: null,
  },
  action: FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT,
});

export default storyTotals;
