import { FETCH_CREATE_REDDIT_COVERAGE } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const redditCoverage = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_CREATE_REDDIT_COVERAGE,
});

export default redditCoverage;
