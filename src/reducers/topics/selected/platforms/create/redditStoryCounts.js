import { FETCH_CREATE_REDDIT_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const redditStoryCounts = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_REDDIT_STORY_COUNTS,
});

export default redditStoryCounts;
