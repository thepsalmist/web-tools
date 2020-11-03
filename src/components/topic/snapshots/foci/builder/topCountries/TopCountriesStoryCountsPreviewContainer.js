import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../../../../common/hocs/AsyncDataContainer';
import { fetchCreateFocusTopCountriesStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import PackedBubbleChart from '../../../../../vis/PackedBubbleChart';
import { mapD3Top10Colors } from '../../../../../../lib/colorUtil';

const BUBBLE_CHART_DOM_ID = 'focalSetCreatePreviewTopCountriesStoriesCounts';

const localMessages = {
  title: { id: 'topic.snapshot.topCountries.storyCount.title', defaultMessage: 'Stories By Top Countries' },
  intro: { id: 'topic.snapshot.topCountries.storyCount.intro', defaultMessage: 'Stories about however many most-talked-about-countries' },
};

const TopCountriesStoryCountsPreviewContainer = (props) => {
  const { counts } = props;
  const { formatNumber } = props.intl;
  let content = null;
  if (counts !== null) {
    const data = counts.map((info, idx) => ({
      value: info.count,
      fill: mapD3Top10Colors(idx),
      rolloverText: `${info.label}: ${formatNumber(info.count)}`,
    }));
    content = (
      <PackedBubbleChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
        width={700}
        padding={30}
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

TopCountriesStoryCountsPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  numCountries: PropTypes.number.isRequired,
  // from state
  counts: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.topCountriesStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.topCountriesStoryCounts.story_counts,
});

const fetchAsyncData = (dispatch, { topicId, numCountries }) => dispatch(fetchCreateFocusTopCountriesStoryCounts(topicId, { numCountries }));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData, ['numCountries'])(
      TopCountriesStoryCountsPreviewContainer
    )
  )
);
