import { FETCH_TOPIC_TIMESPAN_FILES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const mapFiles = createAsyncReducer({
  action: FETCH_TOPIC_TIMESPAN_FILES,
});

export default mapFiles;
