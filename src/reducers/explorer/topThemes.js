import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_TOP_THEMES, RESET_THEMES } from '../../actions/explorerActions';

const topThemes = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], fetchUids: [], results: [], coverage_percentage: 0,
  }),
  action: FETCH_TOP_THEMES,
  [RESET_THEMES]: () => ({
    fetchStatus: '', fetchStatuses: [], fetchUids: [], results: [], coverage_percentage: 0,
  }),
});
export default topThemes;
