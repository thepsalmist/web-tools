import { combineReducers } from 'redux';
import info from './info';
import splitStoryCount from './splitStoryCount';
import stories from './stories';
import inlinks from './inlinks';
import outlinks from './outlinks';
import allInlinks from './allInlinks';
import allOutlinks from './allOutlinks';

const mediaSourceReducer = combineReducers({
  info,
  splitStoryCount,
  stories,
  inlinks,
  outlinks,
  allInlinks,
  allOutlinks,
});

export default mediaSourceReducer;
