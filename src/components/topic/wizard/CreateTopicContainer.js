import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { fetchUserQueuedAndRunningTopics } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import { FETCH_SUCCEEDED } from '../../../lib/fetchConstants';
import TopicBuilderWizard from './TopicBuilderWizard';
import PageTitle from '../../common/PageTitle';
import { TOPIC_FORM_MODE_CREATE } from './TopicForm';

const localMessages = {
  pageTitle: { id: 'topic.modify.pageTitle', defaultMessage: 'Create a Topic' },
  pageDesc: { id: 'topic.modify.pageTitle', defaultMessage: 'You can try out your query in our <a href="https://explorer.mediacloud.org/">Explorer tool</a> before coming here to create a topic.' },
  cannotCreateTopic: { id: 'topic.modify.cannotCreateTopic', defaultMessage: 'You cannot create a new topic right now because you are currently running another topic.' },
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

const CreateTopicContainer = ({ allowedToRun, intl }) => {
  const stepTexts = [
    {
      title: intl.formatMessage(localMessages.pageTitle),
      description: intl.formatHTMLMessage(localMessages.pageDesc),
    },
    {
      title: intl.formatMessage(localMessages.previewTitle),
      description: intl.formatHTMLMessage(localMessages.previewDesc),
    },
    {
      title: intl.formatMessage(localMessages.validateTitle),
      description: intl.formatHTMLMessage(localMessages.validateDesc),
    },
    {
      title: intl.formatMessage(localMessages.confirmTitle),
      description: 'not used',
      saveTopic: intl.formatMessage(localMessages.createTopic),
      savingTitle: intl.formatMessage(localMessages.creatingTitle),
      savingDesc: intl.formatMessage(localMessages.creatingDesc),
    },
  ];
  return (
    <React.Fragment>
      <PageTitle value={localMessages.pageTitle} />
      {!allowedToRun && (
        <WarningNotice><FormattedHTMLMessage {...localMessages.cannotCreateTopic} /></WarningNotice>
      )}
      <TopicBuilderWizard
        startStep={0}
        location={window.location}
        mode={TOPIC_FORM_MODE_CREATE}
        currentStepTexts={stepTexts}
        disabled={!allowedToRun}
      />
    </React.Fragment>
  );
};

CreateTopicContainer.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  // from store
  allowedToRun: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.user.isAdmin ? FETCH_SUCCEEDED : state.topics.modify.userRunningTopicStatus.fetchStatus,
  allowedToRun: state.topics.modify.userRunningTopicStatus.allowed, // non-admin users can only run one at a time
  isAdmin: state.user.isAdmin,
});

const fetchAsyncData = (dispatch, { isAdmin }) => {
  reset(); // reset form
  // non-admin users can only run one topic at a time
  if (!isAdmin) {
    dispatch(fetchUserQueuedAndRunningTopics());
  }
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      CreateTopicContainer
    )
  )
);
