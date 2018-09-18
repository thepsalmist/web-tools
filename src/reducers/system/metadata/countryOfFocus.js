import { FETCH_METADATA_VALUES_FOR_COUNTRY_OF_FOCUS } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const countryOfFocus = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
  },
  action: FETCH_METADATA_VALUES_FOR_COUNTRY_OF_FOCUS,
});

export default countryOfFocus;
