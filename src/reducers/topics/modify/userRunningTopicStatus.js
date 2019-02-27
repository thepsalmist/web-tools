import { FETCH_USER_QUEUED_RUNNING_TOPICS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const userRunningTopicStatus = createAsyncReducer({
  initialState: {
    runningTopics: null,
    allowed: true,
  },
  action: FETCH_USER_QUEUED_RUNNING_TOPICS,
  handleSuccess: payload => ({
    runningTopics: payload,
    allowed: payload == null || payload.length === 0,
  }),
});

export default userRunningTopicStatus;
