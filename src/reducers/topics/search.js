import { FETCH_TOPIC_SEARCH_RESULTS } from '../../actions/topicActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';
import { addLatestStateToTopicsList } from './personalList';

const search = createAsyncReducer({
  initialState: {
    topics: [],
  },
  action: FETCH_TOPIC_SEARCH_RESULTS,
  handleSuccess: payload => ({
    ...payload,
    topics: addLatestStateToTopicsList(payload.topics),
  }),
});

export default search;
