import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';
import PlatformWizard from './builder/PlatformWizard';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { topicUpdatePlatform, fetchTopicPlatformById, setTopicNeedsNewSnapshot, selectPlatform } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';

const localMessages = {
  platformSaved: { id: 'focus.edit.saved', defaultMessage: 'We saved your platform.' },
  platformNotSaved: { id: 'focus.edit.notSaved', defaultMessage: 'That didn\'t work for some reason!' },
};

class EditPlatformContainer extends React.Component {
  getInitialValues = () => {
    const { topicId, currentPlatformId, currentPlatformType, platformDetails } = this.props;
    return {
      topicId,
      currentPlatformId,
      currentPlatformType,
      platformDetails,
    };
  }

  render() {
    const { topicId, location, handleUpdatePlatform } = this.props;
    const initialValues = this.getInitialValues();
    return (
      <PlatformWizard
        topicId={topicId}
        startStep={0}
        initialValues={initialValues}
        location={location}
        onDone={handleUpdatePlatform}
      />
    );
  }
}

EditPlatformContainer.propTypes = {
  // from context:
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  // from state
  currentPlatformId: PropTypes.number.isRequired,
  currentPlatformType: PropTypes.string.isRequired,
  platformDetails: PropTypes.object.isRequired,
  // from dispatch
  fetchStatus: PropTypes.string.isRequired,
  handleUpdatePlatform: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  fetchStatus: state.topics.selected.platforms.selected.platformDetails.fetchStatus,
  currentPlatformId: parseInt(ownProps.params.platformId, 10),
  currentPlatformType: state.topics.selected.platforms.selected.select.platform,
  platformDetails: state.topics.selected.platforms.selected.platformDetails,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleUpdatePlatform: (topicId, formValues) => {
    const propsToSubmit = {
      ...formValues,
    };
    // NOTE, this may be a remove/add vs an update on the back end
    return dispatch(topicUpdatePlatform(topicId, ownProps.params.platformId, propsToSubmit))
      .then((results) => {
        if (results.length === 1) {
          // TODO get topicId from return const newOrSameId = results.id
          const platformSavedMessage = ownProps.intl.formatMessage(localMessages.platformSaved);
          dispatch(setTopicNeedsNewSnapshot(true)); // user feedback
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: platformSavedMessage })); // user feedback
          dispatch(push(`/topics/${topicId}/snapshot/foci`)); // go back to focus management page
          dispatch(reset('snapshotFocus')); // it is a wizard so we have to do this by hand
        } else {
          const platformNotSavedMessage = ownProps.intl.formatMessage(localMessages.platformNotSaved);
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: platformNotSavedMessage })); // user feedback
        }
      });
  },
});

const fetchAsyncData = (dispatch, { topicId, platformDetails }) => {
  dispatch(selectPlatform({ ...platformDetails }));
  dispatch(fetchTopicPlatformById(topicId, platformDetails.topics_id));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      EditPlatformContainer
    )
  )
);
