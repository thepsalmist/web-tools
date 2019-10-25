import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { FormattedMessage, injectIntl } from 'react-intl';
import BackLinkingControlBar from '../../BackLinkingControlBar';
import Platform1Container from './Platform1Container';
import Platform2ConfigureContainer from './Platform2ConfigureContainer';
import Platform3DescribeContainer from './Platform3DescribeContainer';
import Platform4ConfirmContainer from './Platform4ConfirmContainer';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';

const localMessages = {
  backToPlatformManager: { id: 'backToPlatformManager', defaultMessage: 'back to Platform Builder' },
  step0Name: { id: 'platform.create.step0Name', defaultMessage: 'Pick a Platform' },
  step1Name: { id: 'platform.create.step1Name', defaultMessage: 'Configure' },
  step2Name: { id: 'platform.create.step2Name', defaultMessage: 'Describe' },
  step3Name: { id: 'platform.create.step3Name', defaultMessage: 'Confirm' },
};

class PlatformWizard extends React.Component {
  componentWillMount = () => {
    const { startStep, goToStep } = this.props;
    goToStep(startStep || 0);
  }

  componentDidMount() {
    const { startStep, goToStep } = this.props;
    goToStep(startStep || 0);
  }

  shouldComponentUpdate = (nextProps) => {
    const { currentStep } = this.props;
    return currentStep !== nextProps.currentStep;
  }

  componentWillUnmount = () => {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { topicId, currentStep, location, initialValues, onDone } = this.props;
    const steps = [
      Platform1Container,
      Platform2ConfigureContainer,
      Platform3DescribeContainer,
      Platform4ConfirmContainer,
    ];
    const CurrentStepComponent = steps[currentStep];
    return (
      <div className="focus-builder-wizard">
        <BackLinkingControlBar message={localMessages.backToPlatformManager} linkTo={`/topics/${topicId}/snapshot/foci`}>
          <Stepper activeStep={currentStep}>
            <Step>
              <StepLabel><FormattedMessage {...localMessages.step0Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel><FormattedMessage {...localMessages.step1Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel><FormattedMessage {...localMessages.step2Name} /></StepLabel>
            </Step>
            <Step>
              <StepLabel><FormattedMessage {...localMessages.step3Name} /></StepLabel>
            </Step>
          </Stepper>
        </BackLinkingControlBar>
        <CurrentStepComponent topicId={topicId} location={location} initialValues={initialValues} onDone={onDone} currentStep={currentStep} />
      </div>
    );
  }
}

PlatformWizard.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  startStep: PropTypes.number,
  location: PropTypes.object,
  onDone: PropTypes.func.isRequired,
  // from state
  currentStep: PropTypes.number.isRequired,
  // from dispatch
  goToStep: PropTypes.func.isRequired,
  handleUnmount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentStep: state.topics.selected.platforms.create ? state.topics.selected.platforms.create.workflow.currentStep : 0,
});

const mapDispatchToProps = dispatch => ({
  goToStep: (step) => {
    dispatch(goToCreatePlatformStep(step));
  },
  handleUnmount: () => {
    dispatch(goToCreatePlatformStep(0)); // reset for next time
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    PlatformWizard
  )
);
