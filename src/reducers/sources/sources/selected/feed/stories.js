import { createAsyncReducer } from '../../../../../lib/reduxHelpers';
import { FETCH_FEED_RECENT_STORIES } from '../../../../../actions/sourceActions';

const stories = createAsyncReducer({
  action: FETCH_FEED_RECENT_STORIES,
});

export default stories;
