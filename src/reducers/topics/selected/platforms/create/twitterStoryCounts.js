import { FETCH_CREATE_TWITTER_STORY_COUNTS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const twitterStoryCounts = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_TWITTER_STORY_COUNTS,
});

export default twitterStoryCounts;
