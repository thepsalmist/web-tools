import { SELECT_PLATFORM, SELECT_PLATFORM_TYPE } from '../../../../actions/topicActions';

const INITIAL_STATE = { topic_seed_queries_id: -1, currentPlatformType: '' };

function selected(state = INITIAL_STATE, action) {
  let updatedState = null;
  switch (action.type) {
    case SELECT_PLATFORM:
      updatedState = state ? { ...state } : undefined; // could be null;
      if (updatedState == null) {
        return { ...action.payload };
      }
      updatedState = action.payload.promise ? { ...state, ...action.payload.promise } : updatedState;
      updatedState.currentPlatformType = updatedState.platform;
      return updatedState;
    case SELECT_PLATFORM_TYPE:
      updatedState = { ...action.payload.promise } || null;
      updatedState.currentPlatformType = updatedState.platform;
      return updatedState;
    default:
      return state;
  }
}

export default selected;
