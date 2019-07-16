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
    ...payload,
    shortList: payload.shortList ? payload.shortList.map(c => ({
      ...c,
      selected: false,
    })) : [],
  }),
});

export default primaryLanguage;
