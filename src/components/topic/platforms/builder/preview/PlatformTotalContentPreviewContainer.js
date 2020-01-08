import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import withAsyncData from '../../../../common/hocs/AsyncDataContainer';
import withDescription from '../../../../common/hocs/DescribedDataCard';
import DataCard from '../../../../common/DataCard';
import BubbleRowChart from '../../../../vis/BubbleRowChart';
import { getBrandDarkColor } from '../../../../../styles/colors';
import { fetchStoryCountsByPlatformQuery } from '../../../../../actions/topicActions';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';

const formSelector = formValueSelector('platform');

const localMessages = {
  title: { id: 'topic.platforms.preview.storyCount.title', defaultMessage: 'Matching Content' },
  helpText: { id: 'topic.platforms.preview.storyCount.help.text',
    defaultMessage: '<p>This is a visualization showing how many pieces of content match your query on the platform.</p>',
  },
  filteredLabel: { id: 'topic.platforms.preview.storyCount.matching', defaultMessage: 'Matching Content' },
  totalLabel: { id: 'topic.platforms.preview.storyCount.total', defaultMessage: 'All Content' },
  descriptionIntro: { id: 'platform.preview.about', defaultMessage: 'Here is a preview of total amount of content we have found that match your query.' },
};

const PlatformTotalContentPreviewContainer = (props) => {
  const { counts } = props;
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
      <h2><FormattedMessage {...localMessages.title} /></h2>
      {content}
    </DataCard>
  );
};

PlatformTotalContentPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topic: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  formatPlatformChannelData: PropTypes.func, // will be pass the formValues, and should return a string suitable for upload to server
  // from state
  counts: PropTypes.object,
  fetchStatus: PropTypes.string.isRequired,
  selectedPlatform: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  topic: state.topics.selected.info,
  fetchStatus: state.topics.selected.platforms.preview.matchingStoryCounts.fetchStatus,
  counts: state.topics.selected.platforms.preview.matchingStoryCounts,
  formValues: formSelector(state, 'media', 'query'),
  selectedPlatform: state.topics.selected.platforms.selected,
});

const fetchAsyncData = (dispatch, { topic, formValues, selectedPlatform, formatPlatformChannelData }) => {
  // call the fetcher the parent passed in to fetch the data we want to show
  dispatch(fetchStoryCountsByPlatformQuery(topic.topics_id, {
    platform_type: selectedPlatform.platform,
    platform_query: formValues.query,
    platform_source: selectedPlatform.source,
    platform_channel: formatPlatformChannelData ? JSON.stringify(formatPlatformChannelData(formValues)) : JSON.stringify(formValues),
    start_date: topic.start_date,
    end_date: topic.end_date,
  }));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withDescription(localMessages.descriptionIntro)(
      withAsyncData(fetchAsyncData, ['query'])(
        PlatformTotalContentPreviewContainer
      )
    )
  )
);
