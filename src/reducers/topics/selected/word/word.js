import { combineReducers } from 'redux';
import info from './info';
import stories from './stories';
import splitStoryCount from './splitStoryCount';
import sampleSentences from './sampleSentences';
import similarWords from './similarWords';

const wordReducer = combineReducers({
  info,
  stories,
  splitStoryCount,
  sampleSentences,
  similarWords,
});

export default wordReducer;
