import { FETCH_TOPIC_SPLIT_STORY_COUNT, SELECT_TIME_AGGREGATE } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { cleanDateCounts, PAST_DAY } from '../../../../lib/dateUtil';

const splitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
    selectedTimePeriod: PAST_DAY,
  },
  action: FETCH_TOPIC_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    total: payload.results.total_story_count,
    counts: cleanDateCounts(payload.results.counts),
  }),
  [SELECT_TIME_AGGREGATE]: payload => ({
    selectedTimePeriod: payload,
  }),
});

export default splitStoryCount;
