import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../../../common/hocs/AsyncDataContainer';
import withHelp from '../../../../common/hocs/HelpfulContainer';
import { fetchStoryCountsByPlatformQuery } from '../../../../../actions/topicActions';
import DataCard from '../../../../common/DataCard';
import BubbleRowChart from '../../../../vis/BubbleRowChart';
import { getBrandDarkColor } from '../../../../../styles/colors';
import { formatTopicOpenWebPreviewQuery } from '../../../../util/topicUtil';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';

const localMessages = {
  title: { id: 'topic.platforms.openWeb.storyCount.title', defaultMessage: 'Story Counts' },
  helpTitle: { id: 'topic.platforms.openWeb.storyCount.help.title', defaultMessage: 'About Story Counts' },
  helpText: { id: 'topic.platforms.openWeb.storyCount.help.text',
    defaultMessage: '<p>This is a visualization showing how many stories would be included in the Platform.</p>',
  },
  filteredLabel: { id: 'topic.platforms.openWeb.storyCount.matching', defaultMessage: 'Matching Stories' },
  totalLabel: { id: 'topic.platforms.openWeb.storyCount.total', defaultMessage: 'All Stories' },
};

const OpenWebStoryCountPreviewContainer = (props) => {
  const { counts, helpButton } = props;
  const { formatMessage, formatNumber } = props.intl;
  let content = null;
  if (counts !== null) {
    const data = [ // format the data for the bubble chart help
      {
        value: counts.count,
        fill: getBrandDarkColor(),
        aboveText: formatMessage(localMessages.filteredLabel),
        aboveTextColor: 'rgb(255,255,255)',
        rolloverText: `${formatMessage(localMessages.filteredLabel)}: ${formatNumber(counts.count)} stories`,
      },
      {
        value: counts.total,
        aboveText: formatMessage(localMessages.totalLabel),
        rolloverText: `${formatMessage(localMessages.totalLabel)}: ${formatNumber(counts.total)} stories`,
      },
    ];
    content = (
      <BubbleRowChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
        width={400}
        padding={30}
      />
    );
  }
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
        {helpButton}
      </h2>
      {content}
    </DataCard>
  );
};

OpenWebStoryCountPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicInfo: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  currentPlatformType: PropTypes.string.isRequired,
  // from state
  counts: PropTypes.object,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  topicInfo: state.topics.selected.info,
  fetchStatus: state.topics.selected.platforms.preview.matchingStoryCounts.fetchStatus,
  counts: state.topics.selected.platforms.preview.matchingStoryCounts,
  media: state.form.platform.values.sourcesAndCollections,
});

const fetchAsyncData = (dispatch, { topicInfo, media }) => {
  const infoForQuery = {
    ...formatTopicOpenWebPreviewQuery({ ...topicInfo, media }),
  };
  dispatch(fetchStoryCountsByPlatformQuery(infoForQuery.topics_id, { ...infoForQuery }));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withHelp(localMessages.helpTitle, localMessages.helpText)(
      withAsyncData(fetchAsyncData, ['query'])(
        OpenWebStoryCountPreviewContainer
      )
    )
  )
);
