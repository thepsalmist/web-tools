import { FETCH_STORY_REDDIT_ATTENTION } from '../../actions/storyActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const reddit = createAsyncReducer({
  initialState: {
    bySub: [],
    total: 0,
  },
  action: FETCH_STORY_REDDIT_ATTENTION,
});

export default reddit;
