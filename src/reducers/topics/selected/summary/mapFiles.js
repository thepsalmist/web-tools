import { FETCH_TOPIC_MAP_FILES } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const mapFiles = createAsyncReducer({
  action: FETCH_TOPIC_MAP_FILES,
});

export default mapFiles;
