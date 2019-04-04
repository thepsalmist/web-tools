import { FETCH_FAVORITE_TOPICS_LIST, SET_TOPIC_FAVORITE } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';
import { addLatestStateToTopicsList, updateFavorite } from './personalList';

const favoriteList = createAsyncReducer({
  initialState: {
    topics: [],
    link_ids: {},
  },
  action: FETCH_FAVORITE_TOPICS_LIST,
  handleSuccess: payload => ({
    ...payload,
    topics: addLatestStateToTopicsList(payload.topics),
  }),
  [SET_TOPIC_FAVORITE]: (payload, state) => ({
    topics: updateFavorite(payload.args[0], payload.args[1], state.topics),
  }),
});

export default favoriteList;
