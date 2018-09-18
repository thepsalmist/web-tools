import { combineReducers } from 'redux';
import entities from './entities';
import nytThemes from './nytThemes';
import info from './info';
import words from './words';

const rootReducer = combineReducers({
  entities,
  nytThemes,
  info,
  words,
});

export default rootReducer;
