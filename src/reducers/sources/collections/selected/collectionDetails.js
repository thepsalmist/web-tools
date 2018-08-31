import { FETCH_COLLECTION_DETAILS } from '../../../../actions/sourceActions';
import { SET_FAVORITE_COLLECTION } from '../../../../actions/systemActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const collectionDetails = createAsyncReducer({
  initialState: {
    object: null,
  },
  action: FETCH_COLLECTION_DETAILS,
  handleSuccess: payload => ({
    object: payload.results,
  }),
  [SET_FAVORITE_COLLECTION]: (payload, state) => ({
    object: Object.assign({}, state.object, {
      ...state.object,
      isFavorite: payload.args[1],
    }),
  }),
});

export default collectionDetails;
