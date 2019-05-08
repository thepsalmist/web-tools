import { FETCH_METADATA_VALUES_FOR_COUNTRY_OF_FOCUS } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const countryOfFocus = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    shortList: [],
  },
  action: FETCH_METADATA_VALUES_FOR_COUNTRY_OF_FOCUS,
  handleSuccess: payload => ({
    // add name and id so we can display it in an Autocomplete
    ...payload,
    shortList: payload.short_list,
  }),
});

export default countryOfFocus;
