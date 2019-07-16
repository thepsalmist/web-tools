import { FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE, RESET_METADATA_SHORTLIST } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const primaryLanguage = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    shortList: [],
  },
  action: FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE,
  handleSuccess: payload => ({
    ...payload,
    shortList: payload.short_list.map(c => ({
      ...c,
      selected: false,
      value: false,
    })),
  }),
  [RESET_METADATA_SHORTLIST]: (payload, state) => ({
    ...state,
    shortList: state.shortList ? state.shortList.map(c => ({
      ...c,
      selected: false,
      value: false,
    })) : [],
  }),
});

export default primaryLanguage;
