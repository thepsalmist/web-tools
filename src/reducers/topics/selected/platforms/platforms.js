import { combineReducers } from 'redux';
import all from './all';
import create from './create/create';

const platforms = combineReducers({
  all,
  create,
});

export default platforms;
