import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const UPDATE_TOPIC_PERMISSION = 'UPDATE_TOPIC_PERMISSION';
export const FETCH_TOPIC_PERMISSIONS = 'FETCH_TOPIC_PERMISSIONS';

// pass in topicId, email & permission
export const updatePermissions = createAsyncAction(UPDATE_TOPIC_PERMISSION, api.topicUpdatePermissions);

// pass in topicId
export const fetchPermissionsList = createAsyncAction(FETCH_TOPIC_PERMISSIONS, api.topicListPermissions);
