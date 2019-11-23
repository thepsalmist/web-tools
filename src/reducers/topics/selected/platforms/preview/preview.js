import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import matchingStoryCounts from './matchingStoryCounts';
import workflow from './workflow';
import matchingAttention from './matchingAttention';
import matchingWords from './matchingWords';

const modifyPlatformReducer = combineReducers({
  workflow,
  matchingStories,
  matchingStoryCounts,
  matchingAttention,
  matchingWords,
});

export default modifyPlatformReducer;
