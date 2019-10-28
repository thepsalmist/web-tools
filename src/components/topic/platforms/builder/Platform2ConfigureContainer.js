import PropTypes from 'prop-types';
import React from 'react';
import { formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import EditOpenWebContainer from './openWeb/EditOpenWebContainer';
// import EditRedditContainer from './retweetPartisanship/EditRetweetPartisanshipContainer';
// import EditTwitterContainer from './topCountries/EditTopCountriesContainer';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import { PLATFORM_OPEN_WEB /* , PLATFORM_REDDIT, PLATFORM_TWITTER */ } from '../../../../lib/platformTypes';
import messages from '../../../../resources/messages';

const formSelector = formValueSelector('platform');

const Platform2ConfigureContainer = (props) => {
  const { topicId, initialValues, handleNextStep, currentPlatform, handlePreviousStep, location } = props;
  let content = null;
  switch (currentPlatform) {
    case PLATFORM_OPEN_WEB:
      content = (
        <EditOpenWebContainer
          topicId={topicId}
          initialValues={initialValues}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          location={location}
        />
      );
      break;
    /* case PLATFORM_REDDIT:
      content = (
        <EditRedditContainer
          topicId={topicId}
          initialValues={initialValues}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          location={location}
        />
      );
      break;
    case PLATFORM_TWITTER:
      content = (
        <EditTwitterContainer
          topicId={topicId}
          initialValues={initialValues}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          location={location}
        />
      );
      break; */
    default:
      content = <FormattedMessage {...messages.unimplemented} />;
  }
  return (
    <div>
      { content }
    </div>
  );
};

Platform2ConfigureContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  // form context
  intl: PropTypes.object.isRequired,
  // from dipatch
  handlePreviousStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  // from state:
  currentPlatform: PropTypes.string.isRequired,
  location: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  currentPlatform: formSelector(state, 'currentPlatform'),
  params: ownProps.params,
});

const mapDispatchToProps = dispatch => ({
  handlePreviousStep: () => {
    dispatch(goToCreatePlatformStep(0));
  },
  handleNextStep: () => {
    dispatch(goToCreatePlatformStep(2));
  },
});

export default
connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(
    Platform2ConfigureContainer
  )
);
