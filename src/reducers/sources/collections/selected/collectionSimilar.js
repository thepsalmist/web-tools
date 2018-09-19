import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_SIMILAR_COLLECTIONS } from '../../../../actions/sourceActions';

const collectionSimilar = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SIMILAR_COLLECTIONS,
  handleSuccess: payload => ({
    total: payload.results.collectionCount,
    list: payload.results.similarCollections,
  }),
});
export default collectionSimilar;
