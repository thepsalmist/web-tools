import { FETCH_SYSTEM_USERS } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const allUsers = createAsyncReducer({
  initialState: {
    users: [],
  },
  action: FETCH_SYSTEM_USERS,
});

export default allUsers;
