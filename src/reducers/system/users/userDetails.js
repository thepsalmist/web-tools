import { FETCH_SYSTEM_USER } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const userDetails = createAsyncReducer({
  initialState: {
    user: null,
  },
  action: FETCH_SYSTEM_USER,
  handleSuccess: payload => ({
    user: payload.results,
  }),
});

export default userDetails;
