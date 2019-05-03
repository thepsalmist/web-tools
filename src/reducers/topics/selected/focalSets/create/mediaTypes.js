import { FETCH_MEDIA_TYPES } from '../../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../../lib/reduxHelpers';

const mediaTypeCoverage = createAsyncReducer({
  initialState: {
    list: null,
  },
  action: FETCH_MEDIA_TYPES,
});

export default mediaTypeCoverage;
