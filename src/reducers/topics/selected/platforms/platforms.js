import { combineReducers } from 'redux';
import all from './all';
import create from './create/create';
import preview from './preview/preview';
import selected from './selected/selected';

const platforms = combineReducers({
  all,
  create,
  preview,
  selected,
});

export default platforms;
