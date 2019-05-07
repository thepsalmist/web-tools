import { FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const primaryLanguage = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    shortList: [],
  },
  action: FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE,
  handleSuccess: payload => ({
    // add name and id so we can display it in an Autocomplete
    shortList: payload.short_list,
  }),
});

export default primaryLanguage;
