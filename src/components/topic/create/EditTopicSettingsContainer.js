import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { filteredLinkTo } from '../../util/location';
import withIntlForm from '../../common/hocs/IntlForm';
import messages from '../../../resources/messages';
import { updateTopic, /* resetTopic, */ setTopicNeedsNewSnapshot } from '../../../actions/topicActions';
import { updateFeedback } from '../../../actions/appActions';
import BackLinkingControlBar from '../BackLinkingControlBar';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import TopicSettingsForm from './TopicSettingsForm';
import { TOPIC_FORM_MODE_EDIT } from './TopicDetailForm';
// import TopicPageTitle from '../TopicPageTitle';

const localMessages = {
  editTopicTitle: { id: 'topic.edit.title', defaultMessage: 'Topic Settings' },
  editTopicText: { id: 'topic.edit.text', defaultMessage: 'You can update this Topic. If you make changes to the query, media sourcs, or dates, those will be reflected in the next snapshot you run.' },
  editTopic: { id: 'topic.edit', defaultMessage: 'Edit Topic Settings' },
  feedback: { id: 'topic.edit.save.feedback', defaultMessage: 'We saved your changes' },
  failed: { id: 'topic.edit.save.failed', defaultMessage: 'Sorry, that didn\'t work!' },
};

const EditTopicSettingsContainer = (props) => {
  // so we have to get them from the formData
  const { topicInfo, topicId, reallyHandleSave } = props;
  const { formatMessage } = props.intl;
  const initialValues = { ...topicInfo, buttonLabel: formatMessage(messages.save) };
  return (
    <div className="topic-edit-form">
      <BackLinkingControlBar message={messages.backToTopic} linkTo={`/topics/${topicId}/summary`} />
      <Grid>
        <Row>
          <Col lg={12}>
            <p><FormattedMessage {...localMessages.editTopicText} /></p>
          </Col>
        </Row>
        <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
          <TopicSettingsForm
            topicId={topicId}
            initialValues={initialValues}
            onSubmit={reallyHandleSave}
            mode={TOPIC_FORM_MODE_EDIT}
            enableReinitialize
            destroyOnUnmount
          />
        </Permissioned>
      </Grid>
    </div>
  );
};

EditTopicSettingsContainer.propTypes = {
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
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  topicId: parseInt(ownProps.params.topicId, 10),
  topicInfo: state.topics.selected.info,
  timespan: state.topics.selected.timespans.selected,
  snapshots: state.topics.selected.snapshots.list,
  user: state.user,
  formData: state.form.topicForm,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  reallyHandleSave: (values, topicInfo, filters) => {
    const infoToSave = { ...values }; // TODO: what of settings vs. query updates?
    infoToSave.is_public = infoToSave.is_public ? 1 : 0;
    infoToSave.is_logogram = infoToSave.is_logogram ? 1 : 0;
    infoToSave.ch_monitor_id = values.ch_monitor_id === undefined ? '' : values.ch_monitor_id;
    return dispatch(updateTopic(ownProps.params.topicId, infoToSave))
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

export default
withIntlForm(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    EditTopicSettingsContainer
  )
);
