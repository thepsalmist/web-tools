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
import { formatTopicOpenWebPreviewQuery } from '../../../../util/topicUtil';

const NUM_TO_SHOW = 20;

const localMessages = {
  title: { id: 'topic.summary.stories.title', defaultMessage: 'Sample Stories' },
  helpTitle: { id: 'topic.summary.stories.help.title', defaultMessage: 'About Matching Top Stories' },
};

const OpenWebStoryPreviewContainer = (props) => {
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

OpenWebStoryPreviewContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  currentPlatformType: PropTypes.string.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  stories: PropTypes.array,
  showTweetCounts: PropTypes.bool,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  fetchStatus: state.topics.selected.platforms.preview.matchingStories.fetchStatus,
  stories: state.topics.selected.platforms.preview.matchingStories.list,
  media: state.form.platform.values.sourcesAndCollections,
});

const fetchAsyncData = (dispatch, { topicInfo, media }) => {
  const infoForQuery = {
    ...formatTopicOpenWebPreviewQuery({ ...topicInfo, media }),
  };
  dispatch(fetchStoriesByPlatformQuery(infoForQuery.topics_id,, { ...infoForQuery }));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, messages.storiesTableHelpText)(
      withAsyncData(fetchAsyncData, ['keywords'])(
        OpenWebStoryPreviewContainer
      )
    )
  )
);
