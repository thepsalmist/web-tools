import { FETCH_CREATE_OPEN_WEB_COVERAGE } from '../../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../../lib/reduxHelpers';

const matchingStories = createAsyncReducer({
  initialState: {
    stories: [],
    links_ids: {},
  },
  action: FETCH_CREATE_OPEN_WEB_COVERAGE,
});

export default matchingStories;
