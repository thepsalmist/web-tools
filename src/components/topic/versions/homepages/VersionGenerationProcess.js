import PropTypes from 'prop-types';
import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { FormattedMessage, injectIntl } from 'react-intl';
import { TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED, TOPIC_SNAPSHOT_STATE_COMPLETED }
  from '../../../../reducers/topics/selected/snapshots';

const localMessages = {
  create: { id: 'version.process.create', defaultMessage: 'Created' },
  queue: { id: 'version.process.queue', defaultMessage: 'Queued' },
  run: { id: 'version.process.run', defaultMessage: 'Running' },
  complete: { id: 'version.process.complete', defaultMessage: 'Completed' },
};

const steps = [
  localMessages.create,
  localMessages.queue,
  localMessages.run,
  localMessages.complete,
];

const stateToStep = {
  [TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED]: 0,
  [TOPIC_SNAPSHOT_STATE_QUEUED]: 1,
  [TOPIC_SNAPSHOT_STATE_ERROR]: 2,
  [TOPIC_SNAPSHOT_STATE_RUNNING]: 2,
  [TOPIC_SNAPSHOT_STATE_COMPLETED]: 3,
};

const getCurrentStep = (snapshot) => {
  let stateToUse;
  let error = false;
  let step = 0;
  if (snapshot && snapshot.state) {
    stateToUse = snapshot.state;
  }
  if (stateToUse === TOPIC_SNAPSHOT_STATE_ERROR) {
    error = true;
    if ((snapshot.job_states.length > 0) && (snapshot.job_states[0].state === TOPIC_SNAPSHOT_STATE_ERROR)) {
      step = 2;
    }
  } else {
    step = stateToStep[stateToUse];
  }
  return { step, error };
};

const VersionGenerationProcess = ({ currentStep, snapshot, job, inError }) => {
  let step;
  let error;
  if (currentStep) {
    step = currentStep;
    error = inError;
  } else {
    const results = getCurrentStep(snapshot, job);
    // eslint-disable-next-line prefer-destructuring
    step = results.step;
    // eslint-disable-next-line prefer-destructuring
    error = results.error;
  }
  return (
    <Stepper activeStep={step}>
      {steps.map((label, idx) => {
        const labelProps = {};
        if ((idx === step) && error) {
          labelProps.error = true;
        }
        return (
          <Step key={label.id}>
            <StepLabel {...labelProps}><FormattedMessage {...label} /></StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

VersionGenerationProcess.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  snapshot: PropTypes.object,
  job: PropTypes.object,
  currentStep: PropTypes.number,
  inError: PropTypes.bool,
};

export default
injectIntl(
  VersionGenerationProcess
);
