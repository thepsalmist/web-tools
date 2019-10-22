import { FETCH_CREATE_TWITTER_COVERAGE } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const twitterCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_TWITTER_COVERAGE,
});

export default twitterCoverage;
