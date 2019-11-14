import { combineReducers } from 'redux';
import { SELECT_PLATFORM } from '../../../../../actions/topicActions';
import platformDetails from './platformDetails';

const INITIAL_STATE = null;

function id(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SELECT_PLATFORM:
      return action.payload ? parseInt(action.payload, 10) : null;
    default:
      return state;
  }
}
const selected = combineReducers({
  id,
  platformDetails,
});

export default selected;
