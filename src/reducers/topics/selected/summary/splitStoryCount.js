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
  // add information about peaks here
  [resolve(FETCH_TOPIC_TOP_STORIES_ON_DATES)]: (payload, state, meta) => ({
    peaks: [...state.peaks, {
      ...payload.peak,
      startTimestamp: meta.args[1].startTimestamp,
      endTimestamp: meta.args[1].endTimestamp,
      storyCount: meta.args[1].storyCount,
    }],
  }),
  // when time period changes we need to clear the peaks info, because the graph has changed
  CLEAR_TOPIC_TOP_STORIES_PEAKS: () => ({
    peaks: [],
  }),
});

export default splitStoryCount;
