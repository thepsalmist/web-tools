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
  title: { id: 'topic.create.preview.attention.title', defaultMessage: 'Matching Stories' },
  descriptionIntro: { id: 'topic.summary.splitStoryCount.help.title', defaultMessage: 'The attention over time to your topic can vary. If you see a predominantly flat line here with no attention, consider going back and changing the start and end dates for your topic. If you have too many total seed stories, try shortening the total number of days your topic covers.' },
  helpText: { id: 'media.splitStoryCount.help.text',
    defaultMessage: '<p>This chart shows you the number of stories over time that match your topic query. This a good preview of the attention paid to your topic that we already have in our system.</p>',
  },
};

const OpenWebAttentionPreview = (props) => {
  const { total, counts, query } = props;
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
          name: query.name,
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
  query: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.platforms.preview.matchingStoryCounts.fetchStatus,
  counts: state.topics.selected.platforms.preview.matchingStoryCounts,
  currentPlatformType: state.form.platform.values.currentPlatformType,
  media: state.form.platform.values.sourcesAndCollections,
});

const fetchAsyncData = (dispatch, { topicInfo, media }) => {
  const infoForQuery = {
    ...formatTopicOpenWebPreviewQuery({ ...topicInfo, media }),
  };
  dispatch(fetchAttentionByPlatformQuery(infoForQuery.topicsId, { ...infoForQuery }));
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
