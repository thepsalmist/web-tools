import { FETCH_SOURCE_TOP_WORDS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { PAST_WEEK } from '../../../../lib/dateUtil';

const topWords = createAsyncReducer({
  initialState: {
    list: [],
    total: null,
    timePeriod: PAST_WEEK,
  },
  action: FETCH_SOURCE_TOP_WORDS,
  handleFetch: payload => ({
    timePeriod: payload.args[1].timePeriod,
  }),
  handleSuccess: payload => ({
    total: payload.total,
    list: payload.results,
  }),
});

export default topWords;
