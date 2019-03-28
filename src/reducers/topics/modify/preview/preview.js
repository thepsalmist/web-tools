import { combineReducers } from 'redux';
import matchingAttention from './matchingAttention';
import matchingStories from './matchingStories';
import matchingStoryCounts from './matchingStoryCounts';
import matchingWords from './matchingWords';
import workflow from './workflow';

const modifyTopicReducer = combineReducers({
  workflow,
  matchingAttention,
  matchingStories,
  matchingStoryCounts,
  matchingWords,
});

export default modifyTopicReducer;
