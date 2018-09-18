import { FETCH_METADATA_VALUES_FOR_MEDIA_TYPE } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const mediaType = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
  },
  action: FETCH_METADATA_VALUES_FOR_MEDIA_TYPE,
});

export default mediaType;
