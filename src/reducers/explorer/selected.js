import { SELECT_QUERY, UPDATE_QUERY, RESET_SELECTED } from '../../actions/explorerActions';
import { autoMagicQueryLabel } from '../../lib/explorerUtil';

const INITIAL_STATE = null;

function selected(state = INITIAL_STATE, action) {
  let updatedState = {};
  switch (action.type) {
    case SELECT_QUERY:
      updatedState = state ? { ...state } : undefined; // could be null;
      if (updatedState == null) {
        return { ...action.payload };
      }
      if (action.payload.uid !== updatedState.uid) {
        updatedState = { ...action.payload }; // leave alone if the same - this isnt an update
      }
      return updatedState;
    case UPDATE_QUERY:
      updatedState = state ? { ...state } : undefined;
      updatedState = { ...action.payload.query };
      if (updatedState.autoNaming) {
        updatedState.label = autoMagicQueryLabel(updatedState);
      }
      if (updatedState.q === '*' || updatedState.q === '') {
        updatedState.autoNaming = true;
      }

      return updatedState;
    case RESET_SELECTED:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default selected;
