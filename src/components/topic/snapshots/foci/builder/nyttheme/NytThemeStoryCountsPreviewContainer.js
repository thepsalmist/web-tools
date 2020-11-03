import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../../../../common/hocs/AsyncDataContainer';
import { fetchCreateFocusNytThemeStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import PackedBubbleChart from '../../../../../vis/PackedBubbleChart';
import { mapD3Top10Colors } from '../../../../../../lib/colorUtil';

const BUBBLE_CHART_DOM_ID = 'focalSetCreatePreviewNytThemesCounts';

const localMessages = {
  title: { id: 'topic.snapshot.nytTheme.storyCount.title', defaultMessage: 'Stories By NYT Themes' },
  intro: { id: 'topic.snapshot.nytTheme.storyCount.intro', defaultMessage: 'Stories catalogued by NYT Themes' },
};

const NytThemeStoryCountsPreviewContainer = (props) => {
  const { counts } = props;
  const { formatNumber } = props.intl;
  let content = null;
  if (counts !== null) {
    const data = counts.map((info, idx) => ({
      value: info.count,
      fill: mapD3Top10Colors(idx),
      rolloverText: `${info.label}: ${formatNumber(info.pct, { style: 'percent', maximumFractionDigits: 2 })}`,
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

NytThemeStoryCountsPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  numThemes: PropTypes.number.isRequired,
  // from state
  counts: PropTypes.array,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.nytThemeStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.nytThemeStoryCounts.story_counts,
});

const fetchAsycData = (dispatch, { topicId, numThemes }) => dispatch(fetchCreateFocusNytThemeStoryCounts(topicId, { numThemes }));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsycData, ['numThemes'])(
      NytThemeStoryCountsPreviewContainer
    )
  )
);
