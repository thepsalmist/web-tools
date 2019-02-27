import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const CREATE_TOPIC = 'CREATE_TOPIC';
export const FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE = 'FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE';
export const FETCH_MODIFY_TOPIC_QUERY_ATTENTION = 'FETCH_MODIFY_TOPIC_QUERY_ATTENTION';
export const FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT = 'FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT';
export const FETCH_MODIFY_TOPIC_QUERY_WORDS = 'FETCH_MODIFY_TOPIC_QUERY_WORDS';
export const GO_TO_TOPIC_STEP = 'GO_TO_TOPIC_STEP';

export const CREATE_SNAPSHOT = 'CREATE_SNAPSHOT';
export const CREATE_VERSION = 'CREATE_VERSION';

export const createTopic = createAsyncAction(CREATE_TOPIC, api.createTopic);

export const createSnapshot = createAsyncAction(CREATE_SNAPSHOT, api.createSnapshot);

export const createVersion = createAsyncAction(CREATE_VERSION, api.createVersion);

export const fetchStoryCountByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_STORY_COUNT, api.fetchStoryCountByQuery);

export const fetchAttentionByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_ATTENTION, api.fetchAttentionByQuery);

export const fetchStorySampleByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_STORY_SAMPLE, api.fetchStorySampleByQuery);

export const fetchWordsByQuery = createAsyncAction(FETCH_MODIFY_TOPIC_QUERY_WORDS, api.fetchWordsByQuery);

// pass in the number of the step to go to
export const goToTopicStep = createAction(GO_TO_TOPIC_STEP, step => step);
