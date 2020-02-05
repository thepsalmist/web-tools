import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PlatformFormContainer from './PlatformFormContainer';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';

const Platform1ConfigureContainer = ({ topicId, topicInfo, initialValues, handleNextStep, selectedPlatform, location }) => (
  <PlatformFormContainer
    topicId={topicId}
    topicInfo={topicInfo}
    // onPreviousStep={handlePreviousStep}
    onNextStep={handleNextStep}
    location={location}
    initialValues={{ ...initialValues, ...selectedPlatform }}
  />
);

Platform1ConfigureContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  // form context
  intl: PropTypes.object.isRequired,
  // from dipatch
  handleNextStep: PropTypes.func.isRequired,
  // from state:
  selectedPlatform: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  selectedPlatform: state.topics.selected.platforms.selected,
  topicInfo: state.topics.selected.info,
  params: ownProps.params,
});

const mapDispatchToProps = dispatch => ({
  handleNextStep: () => {
    dispatch(goToCreatePlatformStep(1));
  },
});

export default
connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(
    Platform1ConfigureContainer
  )
);
