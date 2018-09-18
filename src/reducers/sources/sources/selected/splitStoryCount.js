import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_SOURCE_SPLIT_STORY_COUNT } from '../../../../actions/sourceActions';
import { cleanDateCounts, cleanCoverageGaps } from '../../../../lib/dateUtil';

const splitStoryCount = createAsyncReducer({
  initialState: {
    all_stories: {},
    partial_stories: {},
  },
  action: FETCH_SOURCE_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    all_stories: {
      total: payload.results.all_stories.total_story_count,
      list: cleanDateCounts(payload.results.all_stories.list),
      health: cleanCoverageGaps((payload.results.all_stories.health) ? payload.results.all_stories.health.coverage_gaps_list : null),
    },
    partial_stories: {
      total: payload.results.partial_stories.total_story_count,
      list: cleanDateCounts(payload.results.partial_stories.list),
      health: cleanCoverageGaps((payload.results.partial_stories.health) ? payload.results.partial_stories.health.coverage_gaps_list : null),

    },
  }),
});
export default splitStoryCount;
