import { SELECT_MEDIAPICKER_QUERY_ARGS, RESET_MEDIAPICKER_QUERY_ARGS } from '../../../actions/systemActions';
import { PICK_FEATURED } from '../../../lib/explorerUtil';

const INITIAL_STATE = { args: { type: PICK_FEATURED, mediaKeyword: null, tags: null } };

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
