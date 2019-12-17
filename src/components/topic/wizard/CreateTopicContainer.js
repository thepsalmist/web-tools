import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { fetchUserQueuedAndRunningTopics } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import { FETCH_SUCCEEDED } from '../../../lib/fetchConstants';
import PageTitle from '../../common/PageTitle';
import TopicSeedDetailsForm from './TopicSeedDetailsForm';

const localMessages = {
  pageTitle: { id: 'topic.modify.pageTitle', defaultMessage: 'Create a Topic' },
  pageDesc: { id: 'topic.modify.pageTitle', defaultMessage: 'You can try out your query in our <a href="https://explorer.mediacloud.org/">Explorer tool</a> before coming here to create a topic.' },
  cannotCreateTopic: { id: 'topic.modify.cannotCreateTopic', defaultMessage: 'You cannot create a new topic right now because you are currently running another topic.' },
  createTopic: { id: 'topic.create', defaultMessage: 'Create Topic' },
  creatingTitle: { id: 'topic.creating.title', defaultMessage: 'Please wait - we\'re creating your Topic now' },
  creatingDesc: { id: 'topic.creating.detail', defaultMessage: 'We are creating your topic now.  This can take a minute or so, just to make sure everyting is in order.  Once it is created, you\'ll be shown a page telling you we are gathering the stories.' },
};

const CreateTopicContainer = (props) => (
  <>
    <PageTitle value={localMessages.pageTitle} />
    {!props.allowedToRun && (
      <WarningNotice><FormattedHTMLMessage {...localMessages.cannotCreateTopic} /></WarningNotice>
    )}
    <TopicSeedDetailsForm
      destroyOnUnmount={false}
      form="topicForm"
      forceUnregisterOnUnmount
      // defaultValue={initialValues}
      // mode={mode}
    />
  </>
);

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
