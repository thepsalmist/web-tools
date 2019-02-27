import { combineReducers } from 'redux';
import preview from './preview/preview';
import userRunningTopicStatus from './userRunningTopicStatus';

const createTopicReducer = combineReducers({
  preview,
  userRunningTopicStatus,
});

export default createTopicReducer;
