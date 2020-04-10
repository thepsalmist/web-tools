import { combineReducers } from 'redux';
import info from './info';
import inlinks from './inlinks';
import outlinks from './outlinks';

const storyReducer = combineReducers({
  info,
  inlinks,
  outlinks,
});

export default storyReducer;
