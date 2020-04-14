import { combineReducers } from 'redux';
import { FETCH_TOPIC_PROVIDER_WORDS, FETCH_TOPIC_PROVIDER_STORIES, FETCH_TOPIC_PROVIDER_COUNT_OVER_TIME } from '../../../actions/topicActions';
import { createIndexedAsyncReducer } from '../../../lib/reduxHelpers';
import { cleanDateCounts } from '../../../lib/dateUtil';

const providerReducer = combineReducers({

  words: createIndexedAsyncReducer({ action: FETCH_TOPIC_PROVIDER_WORDS }),

  stories: createIndexedAsyncReducer({ action: FETCH_TOPIC_PROVIDER_STORIES }),

  countOverTime: createIndexedAsyncReducer({
    action: FETCH_TOPIC_PROVIDER_COUNT_OVER_TIME,
    handleSuccess: payload => ({
      total: payload.total_story_count,
      counts: cleanDateCounts(payload.counts),
    }),
  }),

});

export default providerReducer;
