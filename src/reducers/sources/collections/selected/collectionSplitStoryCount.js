import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_COLLECTION_SPLIT_STORY_COUNT } from '../../../../actions/sourceActions';
import { cleanDateCounts } from '../../../../lib/dateUtil';

const collectionSplitStoryCount = createAsyncReducer({
  initialState: {
    all_stories: {},
    partial_stories: {},
    interval: 'day',
  },
  action: FETCH_COLLECTION_SPLIT_STORY_COUNT,
  handleSuccess: payload => ({
    all_stories: {
      total: payload.results.all_stories.total_story_count,
      list: cleanDateCounts(payload.results.all_stories.list),
    },
    partial_stories: {
      total: payload.results.partial_stories.total_story_count,
      list: cleanDateCounts(payload.results.partial_stories.list),
    },
  }),
});
export default collectionSplitStoryCount;
