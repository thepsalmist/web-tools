import { FETCH_PLATFORM_PREVIEW_ATTENTION } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../../../lib/dateUtil';

const matchingAttention = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
  },
  action: FETCH_PLATFORM_PREVIEW_ATTENTION,
  handleSuccess: payload => ({
    total: payload.results.total_story_count,
    counts: cleanDateCounts(payload.results.counts),
  }),
});

export default matchingAttention;
