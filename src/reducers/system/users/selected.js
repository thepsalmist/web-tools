import { combineReducers } from 'redux';
import { SELECT_SYSTEM_USER } from '../../../actions/systemActions';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_SYSTEM_USER:
      return action.payload ? parseInt(action.payload, 10) : null;
    default:
      return state;
  }
}

const selected = combineReducers({
  id,
});

export default selected;
