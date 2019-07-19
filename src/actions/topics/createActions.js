import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const CREATE_TOPIC = 'CREATE_TOPIC';
export const createTopic = createAsyncAction(CREATE_TOPIC, api.createTopic);

export const FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT = 'FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT';
export const fetchStoryCountByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT, api.fetchStoryCountByQuery);

export const FETCH_MODIFY_TOPIC_QUERY_ATTENTION = 'FETCH_MODIFY_TOPIC_QUERY_ATTENTION';
export const fetchAttentionByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_ATTENTION, api.fetchAttentionByQuery);

export const FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE = 'FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE';
export const fetchStorySampleByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE, api.fetchStorySampleByQuery);

export const FETCH_MODIFY_TOPIC_QUERY_WORDS = 'FETCH_MODIFY_TOPIC_QUERY_WORDS';
export const fetchWordsByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_WORDS, api.fetchWordsByQuery);

// pass in the number of the step to go to
export const GO_TO_TOPIC_STEP = 'GO_TO_TOPIC_STEP';
export const goToTopicStep = createAction(GO_TO_TOPIC_STEP, step => step);
