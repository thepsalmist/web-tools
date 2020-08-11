import { FETCH_STORY, SELECT_STORY, RESET_STORY } from '../../actions/storyActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const info = createAsyncReducer({
  initialState: {
    fetchStatus: '', fetchStatuses: [], id: null, stories_id: null,
  },
  action: FETCH_STORY,
  [SELECT_STORY]: payload => ({ ...payload, selectedStory: true }),
  [RESET_STORY]: () => ({ fetchStatus: '', fetchStatuses: [], id: null, stories_id: null }),
});

export default info;
