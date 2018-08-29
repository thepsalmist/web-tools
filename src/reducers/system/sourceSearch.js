import { FETCH_SYSTEM_SOURCE_SEARCH, RESET_SYSTEM_SOURCE_SEARCH } from '../../actions/systemActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const sourceSearch = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_SYSTEM_SOURCE_SEARCH,
  handleSuccess: payload => ({
    // add name and id so we can display it in an Autocomplete
    list: payload.list.map(m => ({ ...m, id: m.media_id, type: 'mediaSource' })),
  }),
  [RESET_SYSTEM_SOURCE_SEARCH]: () => ({ list: [] }),
});

export default sourceSearch;
