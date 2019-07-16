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
    ...payload,
    shortList: payload.short_list.map(c => ({
      ...c,
      selected: false,
    })),
  }),
});

export default countryOfFocus;
