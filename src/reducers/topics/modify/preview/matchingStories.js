import { FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const matchingStorySamples = createAsyncReducer({
  initialState: {
    list: [],
    links_ids: {},
  },
  action: FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE,
  handleSuccess: payload => ({
    total: payload.length,
    list: payload,
  }),
});

export default matchingStorySamples;
