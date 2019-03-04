import { createAsyncAction } from '../../lib/reduxHelpers';
import * as systemApi from '../../lib/serverApi/system';

export const FETCH_TOP_ANALYTICS_RESULTS = 'FETCH_TOP_ANALYTICS_RESULTS';
export const fetchTopAnalyticsResults = createAsyncAction(FETCH_TOP_ANALYTICS_RESULTS, systemApi.fetchTopAnalyticsResults, params => params);
