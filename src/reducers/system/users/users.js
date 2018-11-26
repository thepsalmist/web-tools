import { combineReducers } from 'redux';
import selected from './selected';
import allUsers from './all';

const users = combineReducers({
  allUsers,
  selected,
});

export default users;
