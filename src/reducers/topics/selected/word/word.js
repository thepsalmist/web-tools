import { combineReducers } from 'redux';
import info from './info';
import words from './words';
import stories from './stories';
import splitStoryCount from './splitStoryCount';
import sampleSentences from './sampleSentences';
import similarWords from './similarWords';

const wordReducer = combineReducers({
  info,
  words,
  stories,
  splitStoryCount,
  sampleSentences,
  similarWords,
});

export default wordReducer;
