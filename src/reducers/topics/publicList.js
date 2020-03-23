import { FETCH_PUBLIC_TOPICS_LIST, SET_TOPIC_FAVORITE } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';
import { addUsefulDetailsToTopicsList, updateFavorite } from './personalList';

const personalList = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_PUBLIC_TOPICS_LIST,
  handleSuccess: payload => ({
    ...payload,
    topics: addUsefulDetailsToTopicsList(payload.topics),
  }),
  [SET_TOPIC_FAVORITE]: (payload, state) => ({
    topics: updateFavorite(payload.args[0], payload.args[1], state.topics),
  }),
});

export default personalList;
