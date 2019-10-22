import { combineReducers } from 'redux';
import openWebStories from './openWebStories';
import openWebStoryCounts from './openWebStoryCounts';
import redditCoverage from './redditCoverage';
import redditStoryCounts from './redditStoryCounts';
import twitterCoverage from './twitterCoverage';
import twitterStoryCounts from './twitterStoryCounts';
import workflow from './workflow';

const createFocusReducer = combineReducers({
  openWebStories,
  openWebStoryCounts,
  redditCoverage,
  redditStoryCounts,
  twitterCoverage,
  twitterStoryCounts,
  workflow,
});

export default createFocusReducer;
