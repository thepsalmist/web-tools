import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';
import FocusBuilderWizard from '../snapshots/foci/builder/FocusBuilderWizard';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { topicCreatePlatform, fetchTopicPlatforms, setTopicNeedsNewSnapshot } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';

const localMessages = {
  platformSaved: { id: 'focus.edit.saved', defaultMessage: 'We saved your platform.' },
  platformNotSaved: { id: 'focus.edit.notSaved', defaultMessage: 'That didn\'t work for some reason!' },
};

class EditPlatformContainer extends React.Component {
  getInitialValues = () => {
    const { topicId, platformInfo } = this.props;
    return {
      topicId,
      platformInfo,
    };
  }

  render() {
    const { topicId, location, handleDone } = this.props;
    const intialValues = this.getInitialValues();
    return (
      <FocusBuilderWizard
        topicId={topicId}
        startStep={1}
        initialValues={intialValues}
        location={location}
        onDone={handleDone}
      />
    );
  }
}

EditPlatformContainer.propTypes = {
  // from context:
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  // from state
  platformInfo: PropTypes.object.isRequired,
  // from dispatch
  fetchStatus: PropTypes.string.isRequired,
  handleDone: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  topicId: parseInt(ownProps.params.topicId, 10),
  fetchStatus: state.topics.selected.focalSets.definitions.fetchStatus,
  platformId: parseInt(ownProps.params.platformId, 10),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleAddPlatform: (topicId, formValues) => {
    const propsToSubmit = {
      platform_id: parseInt(ownProps.params.platformId, 10),
      ...formValues,
    };
    return dispatch(topicCreatePlatform(topicId, propsToSubmit))
      .then((results) => {
        if (results.length === 1) {
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

const fetchAsyncData = (dispatch, { topicId }) => dispatch(fetchTopicPlatforms(topicId));

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      EditPlatformContainer
    )
  )
);
