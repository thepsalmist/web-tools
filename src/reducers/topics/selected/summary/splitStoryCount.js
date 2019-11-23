import { FETCH_TOPIC_SPLIT_STORY_COUNT, RESET_TOPIC_ATTENTION_DRILL_DOWN, SET_TOPIC_ATTENTION_DRILL_DOWN } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { cleanDateCounts, PAST_DAY } from '../../../../lib/dateUtil';

const splitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
    selectedTimePeriod: PAST_DAY,
    drillDownTimespan: null,
  },
  action: FETCH_TOPIC_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    total: payload.results.total_story_count,
    counts: cleanDateCounts(payload.results.counts),
  }),
  // when clicked item changes we need to clear it all
  [SET_TOPIC_ATTENTION_DRILL_DOWN]: (payload) => ({
    drillDownStories: [],
    drillDownTimespan: { ...payload },
  }),
  // when clicked item changes we need to clear it all
  [RESET_TOPIC_ATTENTION_DRILL_DOWN]: () => ({
    drillDownStories: [],
    drillDownTimespan: null,
  }),
});

export default splitStoryCount;
