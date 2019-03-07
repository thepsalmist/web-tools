import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { filteredLinkTo } from '../../util/location';
import withIntlForm from '../../common/hocs/IntlForm';
import messages from '../../../resources/messages';
import { updateAndCreateNewTopicVersion, /* resetTopic, */ setTopicNeedsNewSnapshot } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import BackLinkingControlBar from '../BackLinkingControlBar';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import TopicForm, { TOPIC_FORM_MODE_EDIT } from '../wizard/TopicForm';
import UpdateForStorySearchWarning from '../UpdateForStorySearchWarning';
import TopicPageTitle from '../TopicPageTitle';

const localMessages = {
  editTopicTitle: { id: 'topic.edit.title', defaultMessage: 'Topic Settings' },
  editTopicText: { id: 'topic.edit.text', defaultMessage: 'You can update this Topic. If you make changes to the query, media sourcs, or dates, those will be reflected in the next snapshot you run.' },
  editTopic: { id: 'topic.edit', defaultMessage: 'Edit Topic' },
  editTopicSettingsTitle: { id: 'topic.edit.editTopicCollectionsTitle', defaultMessage: 'Edit Settings' },
  feedback: { id: 'topic.edit.save.feedback', defaultMessage: 'We saved your changes' },
  failed: { id: 'topic.edit.save.failed', defaultMessage: 'Sorry, that didn\'t work!' },
  editRisk: { id: 'topic.edit.save.risk', defaultMessage: 'You have modified this topic and if you proceed you may corrupt your topic!' },
  riskConfirmTitle: { id: 'topic.edit.save.riskConfirmTitle', defaultMessage: 'Warning! Be Careful' },
  handleRiskDescription: { id: 'topic.edit.save.handleRiskDescription', defaultMessage: 'Narrowing these topic settings (date range, seed query and/or media) requires you to re-spider, but previous stories that matched them will NOT be removed. This means your topic will be a confusing combination of what you have now and what you want to have. Only confirm if you know what you are doing.' },
  resetting: { id: 'topic.edit.save.resetting', defaultMessage: 'Resetting Topic. Please wait....' },
};

class TopicSettingsContainer extends React.Component {
  handleConfirmSave = () => {
    const { formData, topicInfo, handleSave } = this.props;
    return handleSave(formData.values, topicInfo);
  };

  handleRequestSave = (values) => {
    const { topicInfo, handleSave } = this.props;
    return handleSave(values, topicInfo);
  };

  render() {
    // so we have to get them from the formData
    const { topicInfo, topicId } = this.props;
    const { formatMessage } = this.props.intl;
    const initialValues = {};
    return (
      <div className="topic-edit-form">
        <BackLinkingControlBar message={messages.backToTopic} linkTo={`/topics/${topicId}/summary`} />
        <Grid>
          <TopicPageTitle value={localMessages.editTopicTitle} />
          <Row>
            <Col lg={12}>
              <h1><FormattedMessage {...localMessages.editTopicTitle} /></h1>
              <p><FormattedMessage {...localMessages.editTopicText} /></p>
              {(topicInfo.is_story_index_ready === false) && (<UpdateForStorySearchWarning />)}
            </Col>
          </Row>
          <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
            <TopicForm
              topicId={topicId}
              initialValues={initialValues}
              onSubmit={this.handleRequestSave}
              title={formatMessage(localMessages.editTopicSettingsTitle)}
              mode={TOPIC_FORM_MODE_EDIT}
              enableReinitialize
              destroyOnUnmount
            />
          </Permissioned>
        </Grid>
      </div>
    );
  }
}

TopicSettingsContainer.propTypes = {
  // from context
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  params: PropTypes.object,
  // from state
  timespan: PropTypes.object,
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number,
  topicInfo: PropTypes.object,
  formData: PropTypes.object,
  // from dispatch/merge
  handleSave: PropTypes.func.isRequired,
  reallyHandleSave: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: parseInt(ownProps.params.topicId, 10),
  topicInfo: state.topics.selected.info,
  timespan: state.topics.selected.timespans.selected,
  snapshots: state.topics.selected.snapshots.list,
  user: state.user,
  formData: state.form.topicForm,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  reallyHandleSave: (values, topicInfo, filters) => {
    const infoToSave = { ...values }; // clone it so we can edit as needed
    infoToSave.is_public = infoToSave.is_public ? 1 : 0;
    infoToSave.is_logogram = infoToSave.is_logogram ? 1 : 0;
    infoToSave.ch_monitor_id = values.ch_monitor_id === undefined ? '' : values.ch_monitor_id;
    return dispatch(updateAndCreateNewTopicVersion(ownProps.params.topicId, infoToSave))
      .then((results) => {
        if (results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ classes: 'info-notice', open: true, message: ownProps.intl.formatMessage(localMessages.feedback) }));
          // if the dates changed tell them it needs a new snapshot
          if ((infoToSave.start_date !== topicInfo.start_date) || (infoToSave.end_date !== topicInfo.end_date)) {
            dispatch(setTopicNeedsNewSnapshot(true));
          }
          const topicSummaryUrl = filteredLinkTo(`/topics/${results.topics_id}/summary`, filters);
          dispatch(push(topicSummaryUrl));
          // update topic info and redirect back to topic summary
        } else if (results.status === 500 && results.message.indexOf('cannot reduce') > -1) {
          dispatch(updateFeedback({ classes: 'warning-notice', open: true, message: ownProps.intl.formatMessage(localMessages.resetting) }));
          // dispatch(resetTopic(ownProps.params.topicId));
          const topicSummaryUrl = filteredLinkTo(`/topics/${results.topics_id}/summary`, filters);
          dispatch(push(topicSummaryUrl));
        } else {
          dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
        }
      });
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleSave: (values, topicInfo) => dispatchProps.reallyHandleSave(values, topicInfo, stateProps.filters),
  });
}

const reduxFormConfig = {
  form: 'topicForm',
};

export default
withIntlForm(
  reduxForm(reduxFormConfig)(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      TopicSettingsContainer
    )
  )
);
