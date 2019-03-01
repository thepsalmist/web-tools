import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { fetchUserQueuedAndRunningTopics } from '../../../actions/topicActions';
import { WarningNotice } from '../../common/Notice';
import TopicBuilderWizard from './TopicBuilderWizard';
import { getUserRoles, hasPermissions, PERMISSION_TOPIC_ADMIN } from '../../../lib/auth';
import PageTitle from '../../common/PageTitle';

const localMessages = {
  pageTitle: { id: 'topic.create.pageTitle', defaultMessage: 'Create a Topic' },
  cannotCreateTopic: { id: 'topic.create.cannotCreateTopic', defaultMessage: 'You cannot create a new topic right now because you are currently running another topic: {name} #{id}' },
};

const CreateTopicContainer = (props) => {
  const { canCreateTopic, runningTopics, user } = props;
  // users can only have one running topic at once
  if (!hasPermissions(getUserRoles(user), PERMISSION_TOPIC_ADMIN) && !canCreateTopic) {
    return (
      <WarningNotice><FormattedHTMLMessage {...localMessages.cannotCreateTopic} values={{ name: runningTopics[0].name, id: runningTopics[0].topics_id }} /></WarningNotice>
    );
  }
  return (
    <React.Fragment>
      <PageTitle value={localMessages.pageTitle} />
      <TopicBuilderWizard
        startStep={0}
        location={window.location}
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
  fetchStatus: state.topics.create.userRunningTopicStatus.fetchStatus,
  canCreateTopic: state.topics.create.userRunningTopicStatus.allowed,
  runningTopics: state.topics.create.userRunningTopicStatus.runningTopics,
  user: state.user,
});

const fetchAsyncData = dispatch => dispatch(fetchUserQueuedAndRunningTopics());

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      CreateTopicContainer
    )
  )
);
