import { FETCH_PLATFORM_PREVIEW_WORDS } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const matchingWords = createAsyncReducer({
  initialState: {
    list: [], // the thing you queried for
    totals: [], // options topic/focus-level totals to compare to
  },
  action: FETCH_PLATFORM_PREVIEW_WORDS,
  handleSuccess: payload => ({
    total: payload.results.length,
    list: payload.results,
  }),
});

export default matchingWords;
