import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_SAMPLE_STORIES, RESET_SAMPLE_STORIES } from '../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const stories = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [], selectedStory: {},
  }),
  action: FETCH_QUERY_SAMPLE_STORIES,
  [RESET_SAMPLE_STORIES]: () => ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
});

export default stories;
