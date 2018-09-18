import { FETCH_CREATE_TOPIC_QUERY_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const matchingWords = createAsyncReducer({
  initialState: {
    list: [], // the thing you queried for
    totals: [], // options topic/focus-level totals to compare to
  },
  action: FETCH_CREATE_TOPIC_QUERY_WORDS,
  handleSuccess: payload => ({
    total: payload.length,
    list: payload,
  }),
});

export default matchingWords;
