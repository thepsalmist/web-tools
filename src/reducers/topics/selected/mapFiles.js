import { FETCH_TOPIC_MEDIA_MAP_FILE } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const mapFiles = createAsyncReducer({
  initialState: {
    svgData: '',
  },
  action: FETCH_TOPIC_MEDIA_MAP_FILE,
  // the server endpoint is used for raw data download, so here we need to make it JSON compatible
  handleSuccess: payload => ({ svgData: payload }),
});

export default mapFiles;
