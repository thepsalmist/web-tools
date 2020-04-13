import { combineReducers } from 'redux';
import info from './info';
import splitStoryCount from './splitStoryCount';
import sampleSentences from './sampleSentences';
import similarWords from './similarWords';

const wordReducer = combineReducers({
  info,
  splitStoryCount,
  sampleSentences,
  similarWords,
});

export default wordReducer;
