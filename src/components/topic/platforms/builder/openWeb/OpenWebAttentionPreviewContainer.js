import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../../../common/hocs/AsyncDataContainer';
import { fetchAttentionByPlatformQuery } from '../../../../../actions/topicActions';
import DataCard from '../../../../common/DataCard';
import { getBrandDarkColor } from '../../../../../styles/colors';
import AttentionOverTimeChart from '../../../../vis/AttentionOverTimeChart';
import withDescription from '../../../../common/hocs/DescribedDataCard';
import { formatTopicOpenWebPreviewQuery } from '../../../../util/topicUtil';

const localMessages = {
  title: { id: 'topic.create.preview.attention.title', defaultMessage: 'Attention Over Time' },
  descriptionIntro: { id: 'topic.summary.splitStoryCount.help.title', defaultMessage: 'The attention over time to your topic can vary. If you see a predominantly flat line here with no attention, consider going back and changing the start and end dates for your topic. If you have too many total seed stories, try shortening the total number of days your topic covers.' },
  helpText: { id: 'media.splitStoryCount.help.text',
    defaultMessage: '<p>This chart shows you the number of stories over time that match your topic query. This a good preview of the attention paid to your topic that we already have in our system.</p>',
  },
};

const OpenWebAttentionPreview = (props) => {
  const { total, counts, currentQuery } = props;
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <AttentionOverTimeChart
        lineColor={getBrandDarkColor()}
        total={total}
        series={[{
          id: 0,
          name: currentQuery.name,
          color: getBrandDarkColor(),
          data: counts.map(c => [c.date, c.count]),
          showInLegend: false,
        }]}
        height={250}
      />
    </DataCard>
  );
};

OpenWebAttentionPreview.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // passed in
  topicInfo: PropTypes.object.isRequired,
  currentQuery: PropTypes.string.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.platforms.preview.matchingAttention.fetchStatus,
  topicInfo: state.topics.selected.info,
  total: state.topics.selected.platforms.preview.matchingAttention.total,
  counts: state.topics.selected.platforms.preview.matchingAttention.counts,
  currentPlatformType: state.form.platform.values.currentPlatformType,
  currentQuery: state.form.platform.values.query,
  media: state.form.platform.values.sourcesAndCollections,
});

const fetchAsyncData = (dispatch, { topicInfo, currentQuery, media }) => {
  const infoForQuery = {
    ...formatTopicOpenWebPreviewQuery({ ...topicInfo, query: currentQuery, channel: media }),
  };
  dispatch(fetchAttentionByPlatformQuery(infoForQuery.topics_id, { ...infoForQuery }));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withDescription(localMessages.descriptionIntro, localMessages.helpText)(
      withAsyncData(fetchAsyncData, ['query'])(
        OpenWebAttentionPreview
      )
    )
  )
);
