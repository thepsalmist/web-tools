import { combineReducers } from 'redux';
import { SELECT_PLATFORM, SELECT_PLATFORM_TYPE } from '../../../../../actions/topicActions';
import platformDetails from './platformDetails';

const INITIAL_STATE = { topic_seed_queries_id: -1, platform: '' };

function select(state = INITIAL_STATE, action) {
  let updatedState = null;
  switch (action.type) {
    case SELECT_PLATFORM:
      updatedState = state ? { ...state } : undefined; // could be null;
      if (updatedState == null) {
        return { ...action.payload };
      }
      updatedState = action.payload.promise ? { ...state, ...action.payload.promise } : updatedState;
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
