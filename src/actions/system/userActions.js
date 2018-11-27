import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/system';

export const FETCH_SYSTEM_USERS = 'FETCH_SYSTEM_USERS';

export const fetchSystemUsers = createAsyncAction(FETCH_SYSTEM_USERS, api.fetchSystemUsers);

export const FETCH_SYSTEM_USER = 'FETCH_SYSTEM_USER';

export const fetchSystemUser = createAsyncAction(FETCH_SYSTEM_USER, api.fetchSystemUser);

export const SELECT_SYSTEM_USER = 'SELECT_SYSTEM_USER';

export const selectSystemUser = createAction(SELECT_SYSTEM_USER);

export const UPDATE_SYSTEM_USER = 'UPDATE_SYSTEM_USER';

export const updateSystemUser = createAsyncAction(UPDATE_SYSTEM_USER, api.updateSystemUser);
