import { FETCH_TOPIC_STORY_INFO } from '../../../../actions/topicActions';
import { SELECT_STORY } from '../../../../actions/storyActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const info = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_TOPIC_STORY_INFO,
  [SELECT_STORY]: payload => ({ ...payload }),
});

export default info;
