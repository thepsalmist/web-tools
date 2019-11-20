import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../../../common/hocs/AsyncDataContainer';
import withHelp from '../../../../common/hocs/HelpfulContainer';
import { fetchStoriesByPlatformQuery } from '../../../../../actions/topicActions';
import DataCard from '../../../../common/DataCard';
import TopicStoryTable from '../../../TopicStoryTable';
import messages from '../../../../../resources/messages';
import { formatTopicRedditPreviewForQuery } from '../../../../util/topicUtil';

const NUM_TO_SHOW = 20;

const localMessages = {
  title: { id: 'topic.summary.stories.title', defaultMessage: 'Sample Stories' },
  helpTitle: { id: 'topic.summary.stories.help.title', defaultMessage: 'About Matching Top Stories' },
};

const RedditStoryPreviewContainer = (props) => {
  const { stories, topicId, helpButton, showTweetCounts } = props;
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
        {helpButton}
      </h2>
      <TopicStoryTable stories={stories.slice(0, NUM_TO_SHOW)} showTweetCounts={showTweetCounts} topicId={topicId} />
    </DataCard>
  );
};

RedditStoryPreviewContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  currentPlatformType: PropTypes.string.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  stories: PropTypes.array,
  showTweetCounts: PropTypes.bool,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.platforms.preview.matchingStories.fetchStatus,
  stories: state.topics.selected.platforms.preview.matchingStories.list,
  currentPlatformType: state.form.platform.values.currentPlatformType,
  channel: state.form.platform.values.channel,
});

const fetchAsyncData = (dispatch, { topicInfo, channel }) => {
  const infoForQuery = {
    ...formatTopicRedditPreviewForQuery({ ...topicInfo, channel }),
  };
  dispatch(fetchStoriesByPlatformQuery(infoForQuery.topicsId, { ...infoForQuery }));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, messages.storiesTableHelpText)(
      withAsyncData(fetchAsyncData, ['keywords'])(
        RedditStoryPreviewContainer
      )
    )
  )
);
