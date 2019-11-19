import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import EditOpenWebContainer from './openWeb/EditOpenWebContainer';
import EditRedditContainer from './reddit/EditRedditContainer';
import EditTwitterContainer from './twitter/EditTwitterContainer';
import { goToCreatePlatformStep } from '../../../../actions/topicActions';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER } from '../../../../lib/platformTypes';
import messages from '../../../../resources/messages';

const Platform2ConfigureContainer = (props) => {
  const { topicId, initialValues, handleNextStep, currentPlatformType, currentPlatformInfo, location } = props;
  let content = null;

  switch (currentPlatformType) {
    case PLATFORM_OPEN_WEB:
      const platformDetails = { ...initialValues, ...currentPlatformInfo };
      content = (
        <EditOpenWebContainer
          topicId={topicId}
          // onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          location={location}
          initialValues={platformDetails}
        />
      );
      break;
    case PLATFORM_REDDIT:
      content = (
        <EditRedditContainer
          topicId={topicId}
          initialValues={initialValues}
          // onPreviousStep={handlePreviousStep}
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
          onNextStep={handleNextStep}
          location={location}
        />
      );
      break;
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
  topicInfo: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  // form context
  intl: PropTypes.object.isRequired,
  // from dipatch
  handleNextStep: PropTypes.func.isRequired,
  // from state:
  currentPlatformType: PropTypes.string.isRequired,
  currentPlatformInfo: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  currentPlatformInfo: state.topics.selected.platforms.selected.platformDetails,
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
    Platform2ConfigureContainer
  )
);
