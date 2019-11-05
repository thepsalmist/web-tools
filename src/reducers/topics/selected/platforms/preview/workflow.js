import { GO_TO_CREATE_PLATFORM_STEP } from '../../../../../actions/topicActions';
import { createReducer } from '../../../../../lib/reduxHelpers';

const createTopicWorkflowReducer = createReducer({
  initialState: {
    currentStep: 0,
  },
  [GO_TO_CREATE_PLATFORM_STEP]: payload => ({
    currentStep: payload,
  }),
});

export default createTopicWorkflowReducer;
