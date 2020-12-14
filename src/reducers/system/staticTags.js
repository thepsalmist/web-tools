import { FETCH_STATIC_TAGS } from '../../actions/systemActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const stats = createAsyncReducer({
  action: FETCH_STATIC_TAGS,
});

export default stats;
