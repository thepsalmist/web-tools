import { FETCH_TOPIC_FOCAL_SETS_LIST, TOPIC_FILTER_BY_SNAPSHOT } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const initialState = {
  list: [],
};

const all = createAsyncReducer({
  initialState,
  action: FETCH_TOPIC_FOCAL_SETS_LIST,
  [TOPIC_FILTER_BY_SNAPSHOT]: () => initialState, // when snapshot changes reset these
  handleSuccess: payload => ({
    list: payload,
  }),
});

export default all;
