import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import PlatformWizard from './builder/PlatformWizard';
import { fetchCreateOpenWebPlatform, setTopicNeedsNewSnapshot } from '../../../actions/topicActions';
import { LEVEL_ERROR } from '../../common/Notice';
import { updateFeedback, addNotice } from '../../../actions/appActions';
import { PLATFORM_OPEN_WEB /* , PLATFORM_REDDIT, PLATFORM_TWITTER */ } from '../../../lib/platformTypes';

const DEFAULT_SELECTED_NUMBER = 5;


const localMessages = {
  platformNotSaved: { id: 'platform.create.notSaved', defaultMessage: 'That didn\'t work for some reason!' },
  duplicateName: { id: 'platform.create.invalid', defaultMessage: 'Duplicate name. Choose a unique platform name.' },
  openWebSaved: { id: 'platform.create.openWebSaved', defaultMessage: 'We created a new Open Web platform' },
  twitterSaved: { id: 'platform.create.twitterSaved', defaultMessage: 'We created a new Twitter platform' },
  redditSaved: { id: 'platform.create.reddit.saved', defaultMessage: 'We created a new Reddit platform' },
};


const CreatePlatformContainer = (props) => {
  const { topicId, location, handleDone } = props;
  const initialValues = { numberSelected: DEFAULT_SELECTED_NUMBER };

  return (
    <PlatformWizard
      topicId={topicId}
      startStep={0}
      currentStep={0}
      initialValues={initialValues}
      location={location}
      onDone={handleDone}
    />
  );
};

CreatePlatformContainer.propTypes = {
  // from dispatch
  submitDone: PropTypes.func.isRequired,
  handleDone: PropTypes.func.isRequired,
  // from state
  formData: PropTypes.object,
  // from context:
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  // twitter: state.topics.selected.focalSets.create.topCountriesStoryCounts.story_counts,
  // reddit: state.topics.selected.focalSets.create.nytThemeStoryCounts.story_counts,
  // openWeb: state.topics.selected.platforms.create.openWebStoryCounts.counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  submitDone: (topicId, formValues) => {
    // let saveData = null;
    // const nameAlreadyExists = queryData.focalSetDefinitions.filter(fc => fc.name === formValues.focalSetName);
    /* if (nameAlreadyExists.length > 0) {
      return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.duplicateName) }));
    }
    */
    switch (formValues.platform) {
      case PLATFORM_OPEN_WEB:
        return dispatch(fetchCreateOpenWebPlatform(topicId, formValues))
          .then((results) => {
            if (results.length === 1) {
              const focusSavedMessage = ownProps.intl.formatMessage(localMessages.booleanFocusSaved);
              dispatch(setTopicNeedsNewSnapshot(true)); // user feedback
              dispatch(updateFeedback({ classes: 'info-notice', open: true, message: focusSavedMessage })); // user feedback
              dispatch(push(`/topics/${topicId}/platforms/manage`));
              // dispatch(reset('snapshotFocus')); // it is a wizard so we have to do this by hand
            } else {
              const platformNotSavedMessage = ownProps.intl.formatMessage(localMessages.platformNotSavedMessage);
              dispatch(updateFeedback({ open: true, message: platformNotSavedMessage })); // user feedback
            }
          });
      /*
      case FOCAL_TECHNIQUE_MEDIA_TYPE:
        saveData = { ...formValues };
        return dispatch(createMediaTypeFocalSet(topicId, saveData))
          .then(() => {
            const focusSavedMessage = ownProps.intl.formatMessage(localMessages.mediaTypeFocusSaved);
            dispatch(setTopicNeedsNewSnapshot(true)); // user feedback
            dispatch(updateFeedback({ classes: 'info-notice', open: true, message: focusSavedMessage })); // user feedback
            dispatch(push(`/topics/${topicId}/snapshot/foci`)); // go back to focus management page
            dispatch(reset('snapshotFocus')); // it is a wizard so we have to do this by hand
          });
      */
      default:
        return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.invalid) }));
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return { ...stateProps, ...dispatchProps, ...ownProps, handleDone: (topicId, formValues) => dispatchProps.submitDone(topicId, formValues, stateProps) };
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    CreatePlatformContainer
  )
);
