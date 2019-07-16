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
    ...payload,
    shortList: payload.short_list.map(c => ({
      ...c,
      selected: false,
    })),
  }),
});

export default publicationState;
