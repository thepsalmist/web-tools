import { FETCH_TOPIC_SIMILAR_WORDS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const similarWords = createAsyncReducer({
  initialState: {
    words: [],
  },
  action: FETCH_TOPIC_SIMILAR_WORDS,
});

export default similarWords;
