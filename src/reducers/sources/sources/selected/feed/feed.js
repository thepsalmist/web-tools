import { combineReducers } from 'redux';
import info from './info';
import feeds from './feeds';
import stories from './stories';

const feedReducer = combineReducers({
  info,
  feeds,
  stories,
});

export default feedReducer;
