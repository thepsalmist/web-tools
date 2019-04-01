import { combineReducers } from 'redux';
import entities from './entities';
import nytThemes from './nytThemes';
import info from './info';
import words from './words';
import reddit from './reddit';

const rootReducer = combineReducers({
  reddit,
  entities,
  nytThemes,
  info,
  words,
});

export default rootReducer;
