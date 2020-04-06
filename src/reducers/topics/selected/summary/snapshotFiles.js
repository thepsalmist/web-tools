import { FETCH_TOPIC_SNAPSHOT_FILES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const mapFiles = createAsyncReducer({
  action: FETCH_TOPIC_SNAPSHOT_FILES,
});

export default mapFiles;
