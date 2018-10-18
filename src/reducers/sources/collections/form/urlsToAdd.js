import { CREATE_SOURCES_FROM_URLS } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const urlsToAdd = createAsyncReducer({
  initialState: {
    results: null,
    new: [],
    existing: [],
    error: [],
  },
  action: CREATE_SOURCES_FROM_URLS,
  handleSuccess: payload => ({
    results: payload,
    new: payload.length ? payload.filter(s => s.status === 'new') : [],
    existing: payload.length ? payload.filter(s => s.status === 'existing') : [],
    error: payload.length ? payload.filter(s => s.status === 'error') : [],
  }),
});

export default urlsToAdd;
