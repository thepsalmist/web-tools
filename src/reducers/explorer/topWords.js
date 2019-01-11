import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_QUERY_TOP_WORDS, SELECT_WORD, RESET_SELECTED_WORD } from '../../actions/explorerActions';

const topWords = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '',
    fetchStatuses: [],
    fetchUids: [],
    results: [],
    selectedWord: null,
  }),
  action: FETCH_QUERY_TOP_WORDS,
  [SELECT_WORD]: payload => ({ selectedWord: payload }),
  [RESET_SELECTED_WORD]: () => ({ selectedWord: null }),
});
export default topWords;
