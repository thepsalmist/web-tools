import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/system';

export const RESET_SYSTEM_SOURCE_SEARCH = 'RESET_SYSTEM_SOURCE_SEARCH';
export const FETCH_SYSTEM_SOURCE_SEARCH = 'FETCH_SYSTEM_SOURCE_SEARCH';

export const resetSystemSourceSearch = createAction(RESET_SYSTEM_SOURCE_SEARCH);
export const fetchSystemSourceSearch = createAsyncAction(FETCH_SYSTEM_SOURCE_SEARCH, api.sourceSystemSearch, string => string);
