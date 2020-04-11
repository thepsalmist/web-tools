import { combineReducers } from 'redux';
import info from './info';
import splitStoryCount from './splitStoryCount';

const mediaSourceReducer = combineReducers({
  info,
  splitStoryCount,
});

export default mediaSourceReducer;
