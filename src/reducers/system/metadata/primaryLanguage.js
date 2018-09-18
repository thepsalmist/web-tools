import { FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const primaryLanguage = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
  },
  action: FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE,
});

export default primaryLanguage;
