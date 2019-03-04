import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import withIntlForm from '../../common/hocs/IntlForm';
import LoadingSpinner from '../../common/LoadingSpinner';
import SourceOrCollectionChip from '../../common/SourceOrCollectionChip';
import messages from '../../../resources/messages';
import { createTopic, goToTopicStep, updateTopic } from '../../../actions/topicActions';
import { updateFeedback, addNotice } from '../../../actions/appActions';
import AppButton from '../../common/AppButton';
import { getUserRoles, hasPermissions, PERMISSION_ADMIN } from '../../../lib/auth';
import { LEVEL_ERROR, LEVEL_WARNING, WarningNotice } from '../../common/Notice';
import { MAX_RECOMMENDED_STORIES, MIN_RECOMMENDED_STORIES, WARNING_LIMIT_RECOMMENDED_STORIES } from '../../../lib/formValidators';
import { TOPIC_FORM_MODE_CREATE, TOPIC_FORM_MODE_EDIT } from './TopicForm';

const localMessages = {
  name: { id: 'topic.create.confirm.name', defaultMessage: 'Name' },
  description: { id: 'topic.create.confirm.description', defaultMessage: 'Description' },
  state: { id: 'topic.create.state', defaultMessage: 'Not yet saved.' },
  storyCount: { id: 'topic.create.story.count', defaultMessage: 'Seed Stories' },
  topicSaved: { id: 'topic.create.saved', defaultMessage: 'We saved your new Topic.' },
  topicNotSaved: { id: 'topic.create.notSaved', defaultMessage: 'That didn\'t work!' },
  feedback: { id: 'topic.edit.save.feedback', defaultMessage: 'We were able to {mode} your topic.' },
  failed: { id: 'topic.create.feedback', defaultMessage: 'Sorry, something went wrong.' },
  notEnoughStories: { id: 'topic.create.notenough', defaultMessage: "Sorry, we can't save this topic because you need a minimum of 500 seed stories." },
  tooManyStories: { id: 'topic.create.toomany', defaultMessage: "Sorry, we can't save this topic because you need to select less than 100,000 seed stories." },
  warningLimitStories: { id: 'topic.create.warningLimit', defaultMessage: 'Approaching story limit. Proceed with caution.' },
};

const TopicConfirmContainer = (props) => {
  const { formValues, finishStep, handlePreviousStep, storyCount, handleSubmit, pristine, submitting, currentStepText, mode } = props;
  const { formatMessage } = props.intl;
  let sourcesAndCollections = [];
  sourcesAndCollections = formValues.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
  sourcesAndCollections.concat(formValues.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id));
  const topicDetailsContent = (
    <div>
      <p>
        <b><FormattedMessage {...localMessages.name} /></b>: {formValues.name}
        <br />
        <b><FormattedMessage {...localMessages.description} /></b>: {formValues.description}
      </p>
      <p>
        <b><FormattedMessage {...messages.topicPublicProp} /></b>: { formValues.is_public ? formatMessage(messages.yes) : formatMessage(messages.no) }
        <br />
        <b><FormattedMessage {...messages.topicStartDateProp} /></b>: {formValues.start_date}
        <br />
        <b><FormattedMessage {...messages.topicEndDateProp} /></b>: {formValues.end_date}
        <br />
        <b><FormattedMessage {...localMessages.storyCount} /></b>: {storyCount}
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicQueryProp} /></b>: <code>{formValues.solr_seed_query}</code>
      </p>
      <p>
        <b><FormattedHTMLMessage {...messages.topicSourceCollectionsProp} /></b>:
      </p>
      {formValues.sourcesAndCollections.map(object => (
        <SourceOrCollectionChip key={object.tags_id || object.media_id} object={object} />
      ))}
    </div>
  );
  if (submitting) {
    return (
      <Grid className="topic-container">
        <Row>
          <Col lg={10}>
            <h2>{currentStepText.savingTitle}</h2>
            <p>{currentStepText.savingDesc}</p>
            <LoadingSpinner />
            {topicDetailsContent}
          </Col>
        </Row>
      </Grid>
    );
  }
  // havne't submitted yet
  return (
    <form className="create-topic" name="topicForm" onSubmit={handleSubmit(finishStep.bind(this, mode))}>
      <Grid className="topic-container">
        <Row>
          <Col lg={10}>
            <h2>{currentStepText.title}</h2>
            <WarningNotice><FormattedMessage {...localMessages.state} /></WarningNotice>
            {topicDetailsContent}
            <br />
            <AppButton flat label={formatMessage(messages.previous)} onClick={() => handlePreviousStep(mode)} />
            &nbsp; &nbsp;
            <AppButton
              type="submit"
              disabled={pristine || submitting}
              label={currentStepText.saveTopic}
              primary
            />
          </Col>
        </Row>
      </Grid>
    </form>
  );
};

TopicConfirmContainer.propTypes = {
  // from parent
  initialValues: PropTypes.object,
  currentStepText: PropTypes.object,
  mode: PropTypes.string.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
  handleCreateTopic: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  // from state
  formValues: PropTypes.object.isRequired,
  // from dispatch
  finishStep: PropTypes.func.isRequired,
  handlePreviousStep: PropTypes.func.isRequired,
  storyCount: PropTypes.number,
};

const mapStateToProps = state => ({
  formValues: state.form.topicForm.values,
  storyCount: state.topics.modify.preview.matchingStoryCounts.count,
  user: state.user,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePreviousStep: (mode) => {
    dispatch(push(`/topics/${mode}/1`));
    dispatch(goToTopicStep(1));
  },
  handleCreateTopic: (storyCount, user, values) => {
    if (((storyCount > MIN_RECOMMENDED_STORIES) && (storyCount < MAX_RECOMMENDED_STORIES))
      || hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) { // min/max limits dont apply to admin users
      // all good, so submit!
      const queryInfo = {
        name: values.name,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        solr_seed_query: values.solr_seed_query,
        max_iterations: values.max_iterations,
        ch_monitor_id: values.ch_monitor_id === undefined ? '' : values.ch_monitor_id,
        is_public: values.is_public ? 1 : 0,
        is_logogram: values.is_logogram ? 1 : 0,
        max_stories: values.max_stories,
      };
      queryInfo.is_public = queryInfo.is_public ? 1 : 0;
      if ('sourcesAndCollections' in values) {
        queryInfo['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
        queryInfo['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
      } else {
        queryInfo['sources[]'] = '';
        queryInfo['collections[]'] = '';
      }
      return dispatch(createTopic(queryInfo)).then((results) => {
        if (results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback, { mode: TOPIC_FORM_MODE_CREATE }) }));
          return dispatch(push(`/topics/${results.topics_id}/summary`));
        }
        return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
      });
    }
    if (!hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) {
      // min/max don't apply to admins
      if (storyCount > WARNING_LIMIT_RECOMMENDED_STORIES && storyCount < MAX_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ classes: 'warning-notice', open: true, message: ownProps.intl.formatMessage(localMessages.warningLimitStories) }));
        return dispatch(addNotice({ level: LEVEL_WARNING, message: ownProps.intl.formatMessage(localMessages.warningLimitStories) }));
      }
      if (storyCount > MAX_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.tooManyStories) }));
        return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.tooManyStories) }));
      }
      if (storyCount < MIN_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.notEnoughStories) }));
        return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.notEnoughStories) }));
      }
    }
    return null;
  },
  handleUpdateTopic: (storyCount, user, values) => {
    if (((storyCount > MIN_RECOMMENDED_STORIES) && (storyCount < MAX_RECOMMENDED_STORIES))
      || hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) { // min/max limits dont apply to admin users
      // all good, so submit!
      const queryInfo = {
        topics_id: values.topics_id,
        name: values.name,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        solr_seed_query: values.solr_seed_query,
        max_iterations: values.max_iterations,
        ch_monitor_id: values.ch_monitor_id === undefined ? '' : values.ch_monitor_id,
        is_public: values.is_public ? 1 : 0,
        is_logogram: values.is_logogram ? 1 : 0,
        max_stories: values.max_stories,
      };
      queryInfo.is_public = queryInfo.is_public ? 1 : 0;
      if ('sourcesAndCollections' in values) {
        queryInfo['sources[]'] = values.sourcesAndCollections.filter(s => s.media_id).map(s => s.media_id);
        queryInfo['collections[]'] = values.sourcesAndCollections.filter(s => s.tags_id).map(s => s.tags_id);
      } else {
        queryInfo['sources[]'] = '';
        queryInfo['collections[]'] = '';
      }
      return dispatch(updateTopic(queryInfo.topics_id, { ...queryInfo })).then((results) => {
        if (results.topics_id) {
          // let them know it worked
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.feedback, { mode: TOPIC_FORM_MODE_EDIT }) }));
          return dispatch(push(`/topics/${results.topics_id}/summary`));
        }
        return dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.failed) }));
      });
    }
    if (!hasPermissions(getUserRoles(user), PERMISSION_ADMIN)) {
      // min/max don't apply to admins
      if (storyCount > WARNING_LIMIT_RECOMMENDED_STORIES && storyCount < MAX_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ classes: 'warning-notice', open: true, message: ownProps.intl.formatMessage(localMessages.warningLimitStories) }));
        return dispatch(addNotice({ level: LEVEL_WARNING, message: ownProps.intl.formatMessage(localMessages.warningLimitStories) }));
      }
      if (storyCount > MAX_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.tooManyStories) }));
        return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.tooManyStories) }));
      }
      if (storyCount < MIN_RECOMMENDED_STORIES) {
        dispatch(updateFeedback({ classes: 'error-notice', open: true, message: ownProps.intl.formatMessage(localMessages.notEnoughStories) }));
        return dispatch(addNotice({ level: LEVEL_ERROR, message: ownProps.intl.formatMessage(localMessages.notEnoughStories) }));
      }
    }
    return null;
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    finishStep: (mode) => {
      if (mode === TOPIC_FORM_MODE_EDIT) {
        dispatchProps.handleUpdateTopic(stateProps.storyCount, stateProps.user, stateProps.formValues);
      } else {
        dispatchProps.handleCreateTopic(stateProps.storyCount, stateProps.user, stateProps.formValues);
      }
    },
  });
}

const reduxFormConfig = {
  form: 'topicForm',
  destroyOnUnmount: false, // so the wizard works
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
};

export default
withIntlForm(
  reduxForm(reduxFormConfig)(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      TopicConfirmContainer
    )
  )
);
