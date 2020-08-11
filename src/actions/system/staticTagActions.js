import { createAsyncAction } from '../../lib/reduxHelpers';
import * as systemApi from '../../lib/serverApi/system';

export const FETCH_STATIC_TAGS = 'FETCH_STATIC_TAGS';
export const fetchStaticTags = createAsyncAction(FETCH_STATIC_TAGS, systemApi.fetchStaticTags);
