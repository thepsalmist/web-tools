import { combineReducers } from 'redux';
import selected from './selected';
import allUsers from './all';
import userDetails from './userDetails';

const users = combineReducers({
  allUsers,
  selected,
  userDetails,
});

export default users;
