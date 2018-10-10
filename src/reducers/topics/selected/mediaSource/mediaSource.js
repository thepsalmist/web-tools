import { combineReducers } from 'redux';
import info from './info';
import splitStoryCount from './splitStoryCount';
import stories from './stories';
import inlinks from './inlinks';
import outlinks from './outlinks';
import allInlinks from './allInlinks';
import allOutlinks from './allOutlinks';
import words from './words';

const mediaSourceReducer = combineReducers({
  info,
  splitStoryCount,
  stories,
  inlinks,
  outlinks,
  allInlinks,
  allOutlinks,
  words,
});

export default mediaSourceReducer;
