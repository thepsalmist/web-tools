import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { fetchUserQueuedAndRunningTopics } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import TopicBuilderWizard from './TopicBuilderWizard';
import { getUserRoles, hasPermissions, PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import PageTitle from '../../common/PageTitle';
import { TOPIC_FORM_MODE_CREATE } from './TopicForm';

const localMessages = {
  pageTitle: { id: 'topic.modify.pageTitle', defaultMessage: 'Create a Topic' },
  pageDesc: { id: 'topic.modify.pageTitle', defaultMessage: 'Create a Topic' },
  cannotCreateTopic: { id: 'topic.modify.cannotCreateTopic', defaultMessage: 'You cannot create a new topic right now because you are currently running another topic: {name} #{id}' },
  previewTitle: { id: 'topic.modify.preview.title', defaultMessage: 'Step 2: Preview Your Topic' },
  previewDesc: { id: 'topic.modify.preview.about',
    defaultMessage: '<b>Make sure your topic looks right before you create it</b>.  We start your topic by finding all the stories in our database that match your query. From there we follow all the links and download them. We check if they match your keywords, and if they do then we add them to your topic (this is called "spidering"). Check the result below and make sure your topic is finding you the stories you want before creating it.' },
  validateTitle: { id: 'topic.modify.validate.title', defaultMessage: 'Step 3: Validate 30 Random Stories' },
  validateDesc: { id: 'topic.modify.validate.about',
    defaultMessage: 'To make sure the stories that match your seed query are relevant to your research, you need to review this random sample to see if these are the kinds of stories you want. For each story, click "yes" if it is about the topic you are interested in.  Click "no" if it is not about the topic you are intereseted in.' },
  confirmTitle: { id: 'topic.modify.confirm.title', defaultMessage: 'Step 4: Confirm Your New Topic' },
  name: { id: 'topic.modify.confirm.name', defaultMessage: 'Name' },
  confirmDesc: { id: 'topic.modify.confirm.description', defaultMessage: 'Description' },
  confirmFeedback: { id: 'topic.modify.failed', defaultMessage: 'Successfully created your new topic!' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create Topic' },
  creatingTitle: { id: 'topic.creating.title', defaultMessage: 'Please wait - we\'re creating your Topic now' },
  creatingDesc: { id: 'topic.creating.detail', defaultMessage: 'We are creating your topic now.  This can take a minute or so, just to make sure everyting is in order.  Once it is created, you\'ll be shown a page telling you we are gathering the stories.' },

};

const CreateTopicContainer = (props) => {
  const { canCreateTopic, runningTopics, user } = props;
  const { formatMessage } = props.intl;
  // users can only have one running topic at once
  if (!hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN) && !canCreateTopic) {
    return (
      <WarningNotice><FormattedHTMLMessage {...localMessages.cannotCreateTopic} values={{ name: runningTopics[0].name, id: runningTopics[0].topics_id }} /></WarningNotice>
    );
  }
  const stepTexts = [
    {
      title: formatMessage(localMessages.pageTitle),
      description: formatMessage(localMessages.pageDesc),
    },
    {
      title: formatMessage(localMessages.previewTitle),
      description: formatMessage(localMessages.previewDesc),
    },
    {
      title: formatMessage(localMessages.validateTitle),
      description: formatMessage(localMessages.validateDesc),
    },
    {
      title: formatMessage(localMessages.confirmTitle),
      description: 'not used',
      saveTopic: formatMessage(localMessages.createTopic),
      savingTitle: formatMessage(localMessages.creatingTitle),
      savingDesc: formatMessage(localMessages.creatingDesc),
    },
  ];
  return (
    <React.Fragment>
      <PageTitle value={localMessages.pageTitle} />
      <TopicBuilderWizard
        startStep={0}
        location={window.location}
        mode={TOPIC_FORM_MODE_CREATE}
        currentStepTexts={stepTexts}
      />
    </React.Fragment>
  );
};

CreateTopicContainer.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  // from store
  canCreateTopic: PropTypes.bool,
  runningTopics: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.modify.userRunningTopicStatus.fetchStatus,
  canCreateTopic: state.topics.modify.userRunningTopicStatus.allowed,
  runningTopics: state.topics.modify.userRunningTopicStatus.runningTopics,
  user: state.user,
  formData: state.form.topicForm,
});

const fetchAsyncData = (dispatch) => {
  reset(); // reset form
  dispatch(fetchUserQueuedAndRunningTopics());
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      CreateTopicContainer
    )
  )
);
