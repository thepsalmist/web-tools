import { resolve } from 'redux-simple-promise';
import { FETCH_TOPIC_SPLIT_STORY_COUNT, FETCH_TOPIC_TOP_STORIES_ON_DATES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { cleanDateCounts, PAST_DAY } from '../../../../lib/dateUtil';

const splitStoryCount = createAsyncReducer({
  initialState: {
    total: null,
    counts: [],
    peaks: [],
    selectedTimePeriod: PAST_DAY,
  },
  action: FETCH_TOPIC_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    total: payload.results.total_story_count,
    counts: cleanDateCounts(payload.results.counts),
  }),
  [resolve(FETCH_TOPIC_TOP_STORIES_ON_DATES)]: payload => ({
    peaks: payload.peaks,
  }),
});

export default splitStoryCount;
