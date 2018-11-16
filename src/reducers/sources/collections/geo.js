import { FETCH_GEO_COLLECTIONS_BY_COUNTRY } from '../../../actions/sourceActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const all = createAsyncReducer({
  action: FETCH_GEO_COLLECTIONS_BY_COUNTRY,
});

export default all;
