import { combineReducers } from 'redux';
import { FETCH_TOPIC_ANALYSIS_WORDS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const providerReducer = combineReducers({
  words: createAsyncReducer({ action: FETCH_TOPIC_ANALYSIS_WORDS }),
});

export default providerReducer;
