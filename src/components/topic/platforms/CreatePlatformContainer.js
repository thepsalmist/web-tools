import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push, reset } from 'react-router-redux';
import PlatformWizard from './builder/PlatformWizard';
import { topicCreatePlatform, setTopicNeedsNewSnapshot } from '../../../actions/topicActions';
// import { LEVEL_ERROR } from '../../common/Notice';
import { updateFeedback } from '../../../actions/appActions';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER } from '../../../lib/platformTypes';
import { formatTopicOpenWebPreviewQuery, formatTopicRedditPreviewForQuery, formatTopicTwitterPreviewForQuery } from '../../util/topicUtil';

const DEFAULT_SELECTED_NUMBER = 5;

const localMessages = {
  platformNotSaved: { id: 'platform.create.notSaved', defaultMessage: 'That didn\'t work for some reason!' },
  platformSaved: { id: 'platform.create.saved', defaultMessage: 'That worked!' },
  duplicateName: { id: 'platform.create.invalid', defaultMessage: 'Duplicate name. Choose a unique platform name.' },
  openWebSaved: { id: 'platform.create.openWebSaved', defaultMessage: 'We created a new Open Web platform' },
  twitterSaved: { id: 'platform.create.twitterSaved', defaultMessage: 'We created a new Twitter platform' },
  redditSaved: { id: 'platform.create.reddit.saved', defaultMessage: 'We created a new Reddit platform' },
};


const CreatePlatformContainer = (props) => {
  const { topicInfo, location, handleDone, selectedPlatform } = props;
  const initialValues = { numberSelected: DEFAULT_SELECTED_NUMBER, selectedPlatform };
  if (selectedPlatform.platform === 'twitter') {
    initialValues.channel = [ // TODO, depending on how channel data is prepped from back end, maybe put in reducer or python platform stubs
      { type: 'elite', id: 0, label: 'Elite', selected: false, value: false },
      { type: 'crimson', id: 1, label: 'Crimson Hexagon', selected: false, value: false },
      { type: 'other', id: 2, label: 'Other', selected: false, value: false },
    ];
  }
  const initAndTopicInfoValues = { ...initialValues, ...topicInfo, query: topicInfo.solr_seed_query };

  return (
    <PlatformWizard
      topicId={topicInfo.topics_id}
      startStep={0}
      currentStep={0}
      initialValues={initAndTopicInfoValues}
      location={location}
      onDone={(id, values) => handleDone(initAndTopicInfoValues, values)}
    />
  );
};

CreatePlatformContainer.propTypes = {
  // from dispatch
  submitDone: PropTypes.func.isRequired,
  handleDone: PropTypes.func.isRequired,
  // from state
  values: PropTypes.object,
  selectedPlatform: PropTypes.object.isRequired,
  // from context:
  topicInfo: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  topicInfo: state.topics.selected.info,
  selectedPlatform: state.topics.selected.platforms.selected.platform,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  submitDone: (originalValues, values) => {
    // let saveData = null;
    // const nameAlreadyExists = queryData.focalSetDefinitions.filter(fc => fc.name === formValues.focalSetName);
    /* if (nameAlreadyExists.length > 0) {
      return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.duplicateName) }));
    }
    */
    let infoForQuery = {};

    switch (values.currentPlatformType) {
      case PLATFORM_OPEN_WEB:
        // need media
        infoForQuery = {
          ...formatTopicOpenWebPreviewQuery({ ...originalValues, query: values.query, channel: values.media }),
        };
        break;
      case PLATFORM_TWITTER:
        // source = internet archive or push_shift
        infoForQuery = {
          ...formatTopicTwitterPreviewForQuery({ ...originalValues, query: values.query, channel: values.channel }),
        };
        break;
      case PLATFORM_REDDIT:
        infoForQuery = {
          ...formatTopicRedditPreviewForQuery({ ...originalValues, query: values.query, channel: values.channel }),
        };
        break;
      default:
        return null;
    }
    return dispatch(topicCreatePlatform(originalValues.topics_id, { ...infoForQuery }))
      .then((results) => {
        if (results.success > -1) {
          const platformSavedMessage = ownProps.intl.formatMessage(localMessages.platformSaved);
          dispatch(setTopicNeedsNewSnapshot(true)); // user feedback
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: platformSavedMessage })); // user feedback
          dispatch(push(`/topics/${originalValues.topics_id}/platforms/manage`));
          dispatch(reset('platform')); // it is a wizard so we have to do this by hand
        } else {
          const platformNotSavedMessage = ownProps.intl.formatMessage(localMessages.platformNotSaved);
          dispatch(updateFeedback({ open: true, message: platformNotSavedMessage })); // user feedback
        }
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return { ...stateProps, ...dispatchProps, ...ownProps, handleDone: (topicId, formValues) => dispatchProps.submitDone(stateProps.topicInfo, formValues, stateProps) };
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    CreatePlatformContainer
  )
);
