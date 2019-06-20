import { FETCH_METADATA_VALUES_FOR_STATE } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const publicationState = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    shortList: [],
  },
  action: FETCH_METADATA_VALUES_FOR_STATE,
  handleSuccess: payload => ({
    // add name and id so we can display it in an Autocomplete
    shortList: payload.short_list,
    ...payload,
  }),
});

export default publicationState;
