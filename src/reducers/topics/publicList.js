import { FETCH_PUBLIC_TOPICS_LIST, SET_TOPIC_FAVORITE } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

function updateFavorite(topicId, isFav, topicList) {
  // make sure to return a copy, so redux norms aren't violated
  const matching = [...topicList].find(t => t.topics_id === topicId);
  if (matching) {
    matching.isFavorite = isFav;
  }
  return topicList;
}

const personalList = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_PUBLIC_TOPICS_LIST,
  [SET_TOPIC_FAVORITE]: (payload, state) => ({
    topics: updateFavorite(payload.args[0], payload.args[1], state.topics),
  }),
});

export default personalList;
