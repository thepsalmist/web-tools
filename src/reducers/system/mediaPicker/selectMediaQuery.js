import { SELECT_MEDIAPICKER_QUERY_ARGS, RESET_MEDIAPICKER_QUERY_ARGS } from '../../../actions/systemActions';
import { /* PICK_FEATURED */ PICK_SOURCE_AND_COLLECTION } from '../../../lib/explorerUtil';

const INITIAL_STATE = { args: { type: PICK_SOURCE_AND_COLLECTION, mediaKeyword: null, tags: {}, allMedia: false } };

function selectMediaQuery(state = INITIAL_STATE, action) {
  const updatedState = null;
  switch (action.type) {
    case SELECT_MEDIAPICKER_QUERY_ARGS:
      if (action.payload) { // format should be args: { type, mediaKeyword, tags}
        const args = { ...action.payload };
        return { args };
      }
      return updatedState;
    case RESET_MEDIAPICKER_QUERY_ARGS:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default selectMediaQuery;
