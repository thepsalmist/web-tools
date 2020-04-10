import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topicProvider';

export const FETCH_TOPIC_ANALYSIS_WORDS = 'FETCH_TOPIC_ANALYSIS_WORDS';
export const fetchTopicAnalysisWords = createAsyncAction(FETCH_TOPIC_ANALYSIS_WORDS, api.topicProviderWords);
