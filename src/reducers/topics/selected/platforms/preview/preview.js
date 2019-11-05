import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import matchingStoryCounts from './matchingStoryCounts';
import workflow from './workflow';

const modifyPlatformReducer = combineReducers({
  workflow,
  matchingStories,
  matchingStoryCounts,
});

export default modifyPlatformReducer;
