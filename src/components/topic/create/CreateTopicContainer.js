import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchUserQueuedAndRunningTopics } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import TopicBuilderWizard from './TopicBuilderWizard';
import { getUserRoles, hasPermissions, PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';

const localMessages = {
  cannotCreateTopic: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'You cannot create a new topic right now because you are currently running another topic: {name} #{id}' },
};

const CreateTopicContainer = (props) => {
  const { canCreateTopic, runningTopics, user } = props;

  if (!hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN) && !canCreateTopic) {
    return (
      <WarningNotice><FormattedHTMLMessage {...localMessages.cannotCreateTopic} values={{ name: runningTopics[0].name, id: runningTopics[0].topics_id }} /></WarningNotice>
    );
  }
  return (
    <TopicBuilderWizard
      startStep={0}
      location={window.location}
    />
  );
};

CreateTopicContainer.propTypes = {
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  canCreateTopic: PropTypes.bool,
  runningTopics: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.create.userRunningTopicStatus.fetchStatus,
  canCreateTopic: state.topics.create.userRunningTopicStatus.allowed,
  runningTopics: state.topics.create.userRunningTopicStatus.runningTopics,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchUserQueuedAndRunningTopics());
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      CreateTopicContainer
    )
  )
);
