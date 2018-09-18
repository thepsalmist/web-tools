import { LOCATION_CHANGE } from 'react-router-redux';
import { UPDATE_FEEDBACK, DISMISS_NOTICES, ADD_NOTICE, SET_SUB_HEADER_VISIBLE } from '../actions/appActions';
import { createReducer } from '../lib/reduxHelpers';

const INITIAL_STATE = {
  feedback: {
    open: false,
    message: '',
  },
  notices: [],
  showSubHeader: false,
};

const app = createReducer({
  initialState: INITIAL_STATE,
  [UPDATE_FEEDBACK]: payload => ({ feedback: payload }),
  [ADD_NOTICE]: (payload, state) => ({ notices: [...state.notices, payload] }),
  [DISMISS_NOTICES]: () => ({ notices: [] }),
  [LOCATION_CHANGE]: () => ({ notices: [] }), // empty out errors when the user switches pages
  // when an object is selected we want to show the subheader that app has set
  [SET_SUB_HEADER_VISIBLE]: payload => ({ showSubHeader: payload }),
});

export default app;
