import { createIndexedAsyncReducer } from '../../../lib/reduxHelpers';
import { FETCH_QUERY_SEARCHES } from '../../../actions/explorerActions';
// import { cleanDateCounts } from '../../lib/dateUtil';
// import * as fetchConstants from '../../lib/fetchConstants';

const sources = createIndexedAsyncReducer({
  action: FETCH_QUERY_SEARCHES,
});

export default sources;
