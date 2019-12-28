import PropTypes from 'prop-types';
import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { FormattedMessage, injectIntl } from 'react-intl';
import BackLinkingControlBar from '../BackLinkingControlBar';
import TopicConfigureContainer from './TopicConfigureContainer';
import { goToTopicStep } from '../../../actions/topicActions';
import { TOPIC_FORM_MODE_EDIT } from './TopicForm';
import { filteredLinkTo } from '../../util/location';

const localMessages = {
  backToTopicManager: { id: 'backToTopicManager', defaultMessage: 'back to Home' },
  step0Name: { id: 'topic.modify.step0Name', defaultMessage: 'Configure' },
  step1Name: { id: 'topic.modify.step1Name', defaultMessage: 'Preview' },
  step2Name: { id: 'topic.modify.step2Name', defaultMessage: 'Validate' },
  step3Name: { id: 'topic.modify.step3Name', defaultMessage: 'Confirm' },
};

class TopicBuilderWizard extends React.Component {
  componentDidMount = () => {
    const { startStep, updateStepOnUrl, mode, filters, updateCurrentStep } = this.props;
    updateStepOnUrl(startStep || 0, mode, filters);
    updateCurrentStep(startStep || 0);
  }

  componentWillUnmount = () => {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { currentStep, location, initialValues, currentStepTexts, mode, topic, handleStepChange } = this.props;
    const steps = [
      TopicConfigureContainer,
      /* TopicPreviewContainer,
      TopicValidateContainer,
      TopicConfirmContainer,
      */
    ];
    const CurrentStepComponent = steps[currentStep];
    const stepTexts = currentStepTexts[currentStep];
    const stepLabelStyle = { height: 45 };
    return (
      <div className="topic-builder-wizard">
        <BackLinkingControlBar message={localMessages.backToTopicManager} linkTo="/home">
          <Stepper activeStep={currentStep}>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step0Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step1Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step2Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel style={stepLabelStyle}><FormattedMessage {...localMessages.step3Name} /></StepLabel>
            </Step>
          </Stepper>
        </BackLinkingControlBar>
        <CurrentStepComponent
          location={location}
          initialValues={initialValues}
          currentStepText={stepTexts}
          mode={mode}
          topicInfo={topic}
          onStepChange={handleStepChange}
        />
      </div>
    );
  }
}

TopicBuilderWizard.propTypes = {
  // from parent
  formData: PropTypes.object,
  initialValues: PropTypes.object,
  startStep: PropTypes.number,
  location: PropTypes.object,
  mode: PropTypes.string.isRequired,
  currentStepTexts: PropTypes.array,
  // from state
  currentStep: PropTypes.number.isRequired,
  topic: PropTypes.object,
  filters: PropTypes.object,
  // from dispatch
  updateStepOnUrl: PropTypes.func.isRequired,
  handleUnmount: PropTypes.func.isRequired,
  updateCurrentStep: PropTypes.func.isRequired,
  handleStepChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentStep: state.topics.modify.preview.workflow.currentStep,
  topic: state.topics.selected.info,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateStepOnUrl: (step, mode, filters) => {
    let topicPhrase = '';
    if (mode === TOPIC_FORM_MODE_EDIT) {
      topicPhrase = `/${ownProps.params.topicId}`;
    }
    dispatch(push(filteredLinkTo(`/topics${topicPhrase}/${mode}`, filters, { step })));
  },
  updateCurrentStep: (step) => {
    dispatch(goToTopicStep(parseInt(step, 10)));
  },
  goToUrl: (url) => {
    dispatch(push(url));
  },
  handleUnmount: () => {
    dispatch(goToTopicStep(0));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return { ...stateProps,
    ...dispatchProps,
    ...ownProps,
    handleStepChange: (mode, step) => {
      let topicPhrase = '';
      if (mode === TOPIC_FORM_MODE_EDIT) {
        topicPhrase = `/${stateProps.topic.topics_id}`;
      }
      dispatchProps.goToUrl(filteredLinkTo(`/topics${topicPhrase}/${mode}`, stateProps.filters, { step }));
      dispatchProps.updateCurrentStep(step);
    } };
}

const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false, // so the wizard works
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
};

export default
injectIntl(
  reduxForm(reduxFormConfig)(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps, mergeProps)(
        TopicBuilderWizard
      )
    )
  )
);
