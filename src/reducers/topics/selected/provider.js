import { combineReducers } from 'redux';
import { FETCH_TOPIC_PROVIDER_WORDS, FETCH_TOPIC_PROVIDER_STORIES } from '../../../actions/topicActions';
import { createIndexedAsyncReducer } from '../../../lib/reduxHelpers';

const providerReducer = combineReducers({
  words: createIndexedAsyncReducer({ action: FETCH_TOPIC_PROVIDER_WORDS }),
  stories: createIndexedAsyncReducer({ action: FETCH_TOPIC_PROVIDER_STORIES }),
});

export default providerReducer;
