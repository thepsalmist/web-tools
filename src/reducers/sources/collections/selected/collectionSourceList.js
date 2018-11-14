import { FETCH_COLLECTION_SOURCE_LIST } from '../../../../actions/sourceActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionSourceList = createAsyncReducer({
  initialState: {
    sources: [],
  },
  action: FETCH_COLLECTION_SOURCE_LIST,

  // update an individual source when we fetch details about it for reviewing it for health
  FETCH_SOURCE_REVIEW_INFO_RESOLVED: (payload, state) => {
    const sources = state.sources.map((s) => {
      if (s.media_id === payload.media_id) {
        return { ...s, ...payload };
      }
      return s;
    });
    return { ...state, sources };
  },

});

export default collectionSourceList;
