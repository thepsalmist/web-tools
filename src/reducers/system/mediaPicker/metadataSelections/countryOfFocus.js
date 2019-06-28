import { SELECT_METADATA_QUERY_ARGS } from '../../../../actions/systemActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const countryOfFocus = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    value: false,
    selected: false,
  },
  action: SELECT_METADATA_QUERY_ARGS,
});

export default countryOfFocus;
