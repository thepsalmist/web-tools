import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../../../common/hocs/AsyncContainer';
import { fetchCreateFocusRetweetStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import BubbleRowChart from '../../../../../vis/BubbleRowChart';

// @see http://colorbrewer2.org/#type=diverging&scheme=RdBu&n=5
const PARTISANSHIP_COLORS = ['#0571b0', '#92c5de', '#666666', '#f4a582', '#ca0020'];

const BUBBLE_CHART_DOM_ID = 'focalSetCreatePreviewRetweetPartisanshipCounts';

const localMessages = {
  title: { id: 'topic.snapshot.retweet.storyCount.title', defaultMessage: 'Stories By Partisanship' },
  intro: { id: 'topic.snapshot.retweet.storyCount.intro', defaultMessage: 'This is based on the 1000 media sources with the most retweets during the US 2016 election season. That means each of the quintiles below is NOT evenly distribted.  For instance, while the "center" has just 91 sources, the "right" has 496. Each bubble below shows the percentage of stories that fall into each of the quintiles.' },
};

const RetweetStoryCountsPreviewContainer = (props) => {
  const { counts } = props;
  const { formatNumber } = props.intl;
  let content = null;
  if (counts !== null) {
    const data = counts.map((info, idx) => ({
      value: info.pct,
      fill: PARTISANSHIP_COLORS[idx],
      aboveText: info.label,
      aboveTextColor: 'rgb(0,0,0)',
      rolloverText: `${info.label}: ${formatNumber(info.pct, { style: 'percent', maximumFractionDigits: 2 })}`,
    }));
    content = (
      <BubbleRowChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
        width={700}
        padding={30}
        maxBubbleRadius={60}
        asPercentage
      />
    );
  }
  return (
    <DataCard>
      <h2>
        <FormattedMessage {...localMessages.title} />
      </h2>
      <p><FormattedMessage {...localMessages.intro} /></p>
      {content}
    </DataCard>
  );
};

RetweetStoryCountsPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  // from state
  counts: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.retweetStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.retweetStoryCounts.story_counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchCreateFocusRetweetStoryCounts(ownProps.topicId));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      RetweetStoryCountsPreviewContainer
    )
  )
);
