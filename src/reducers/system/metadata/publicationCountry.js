import { FETCH_METADATA_VALUES_FOR_COUNTRY } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const publicationCountry = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    shortList: [],
  },
  action: FETCH_METADATA_VALUES_FOR_COUNTRY,
  handleSuccess: payload => ({
    // add name and id so we can display it in an Autocomplete
    shortList: payload.short_list,
  }),
});

export default publicationCountry;
