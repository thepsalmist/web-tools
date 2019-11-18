import { combineReducers } from 'redux';
import { SELECT_PLATFORM, SELECT_PLATFORM_TYPE } from '../../../../../actions/topicActions';
import platformDetails from './platformDetails';

const INITIAL_STATE = null;

function select(state = INITIAL_STATE, action) {
  let updatedState = {};
  switch (action.type) {
    case SELECT_PLATFORM:
      updatedState = state ? { ...state } : undefined; // could be null;
      if (updatedState == null) {
        return { ...action.payload };
      }
      updatedState = action.payload.promise ? action.payload.promise : updatedState;
      return updatedState;
    case SELECT_PLATFORM_TYPE:
      updatedState = { ...action.payload.promise } || null;
      return updatedState;
    default:
      return state;
  }
}
const selected = combineReducers({
  select,
  platformDetails,
});

export default selected;
