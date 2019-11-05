import { FETCH_PLATFORM_PREVIEW_STORIES } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const matchingStories = createAsyncReducer({
  initialState: {
    list: [],
    links_ids: {},
  },
  action: FETCH_PLATFORM_PREVIEW_STORIES,
  handleSuccess: payload => ({
    total: payload.length,
    list: payload,
  }),
});

export default matchingStories;
