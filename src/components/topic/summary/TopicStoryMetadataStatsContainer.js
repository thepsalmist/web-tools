import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchTopicGeocodedStoryCoverage, fetchTopicEnglishStoryCounts, fetchTopicUndateableStoryCounts, fetchTopicNytLabelCoverage } from '../../../actions/topicActions';
import StatBar from '../../common/statbar/StatBar';
import messages from '../../../resources/messages';

const localMessages = {
  themedCount: { id: 'topic.summary.storystats.themedCount', defaultMessage: 'Stories Checked for Themes' },
  geocodedCount: { id: 'topic.summary.storystats.geocodedCount', defaultMessage: 'Stories Checked for Entities' },
  englishCount: { id: 'topic.summary.storystats.englishCount', defaultMessage: 'English Stories' },
  undateableCount: { id: 'topic.summary.storystats.undateableCount', defaultMessage: 'Undateable Stories' },
};


class TopicStoryMetadataStatsContainer extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if ((nextProps.filters !== filters)) {
      fetchData(nextProps.filters);
    }
  }

  render() {
    const { timespan, themeCounts, undateableCount, geocodedCounts, englishCounts } = this.props;
    const { formatNumber } = this.props.intl;
    if ((timespan === null) || (timespan === undefined)) {
      return null;
    }
    return (
      <StatBar
        columnWidth={3}
        stats={[
          { message: localMessages.englishCount,
            data: formatNumber(englishCounts.count / geocodedCounts.total, { style: 'percent', maximumFractionDigits: 0 }) },
          { message: localMessages.undateableCount,
            data: formatNumber(undateableCount.count / undateableCount.total, { style: 'percent', maximumFractionDigits: 0 }) },
          { message: localMessages.geocodedCount,
            data: formatNumber(geocodedCounts.count / geocodedCounts.total, { style: 'percent', maximumFractionDigits: 0 }),
            helpTitleMsg: messages.entityHelpTitle,
            helpContentMsg: messages.entityHelpContent,
          },
          { message: localMessages.themedCount,
            data: formatNumber(themeCounts.count / themeCounts.total, { style: 'percent', maximumFractionDigits: 0 }),
            helpTitleMsg: messages.themeHelpTitle,
            helpContentMsg: messages.themeHelpContent,
          },
        ]}
      />
    );
  }

}

TopicStoryMetadataStatsContainer.propTypes = {
  // from parent
  timespan: PropTypes.object,
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from state
  fetchData: PropTypes.func.isRequired,
  fetchStatus: PropTypes.arrayOf(PropTypes.string).isRequired,
  geocodedCounts: PropTypes.object,
  englishCounts: PropTypes.object,
  themeCounts: PropTypes.object,
  undateableCount: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: [
    state.topics.selected.summary.geocodedStoryTotals.fetchStatus,
    state.topics.selected.summary.englishStoryTotals.fetchStatus,
    state.topics.selected.summary.undateableStoryTotals.fetchStatus,
    state.topics.selected.summary.themedStoryTotals.fetchStatus,
  ],
  geocodedCounts: state.topics.selected.summary.geocodedStoryTotals.counts,
  englishCounts: state.topics.selected.summary.englishStoryTotals.counts,
  undateableCount: state.topics.selected.summary.undateableStoryTotals.counts,
  themeCounts: state.topics.selected.summary.themedStoryTotals.counts,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (filters) => {
    dispatch(fetchTopicGeocodedStoryCoverage(ownProps.topicId, filters));
    dispatch(fetchTopicEnglishStoryCounts(ownProps.topicId, filters));
    dispatch(fetchTopicUndateableStoryCounts(ownProps.topicId, filters));
    dispatch(fetchTopicNytLabelCoverage(ownProps.topicId, filters));
  },
  asyncFetch: () => {
    dispatch(fetchTopicGeocodedStoryCoverage(ownProps.topicId, ownProps.filters));
    dispatch(fetchTopicEnglishStoryCounts(ownProps.topicId, ownProps.filters));
    dispatch(fetchTopicUndateableStoryCounts(ownProps.topicId, ownProps.filters));
    dispatch(fetchTopicNytLabelCoverage(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      withAsyncFetch(
        TopicStoryMetadataStatsContainer
      )
    )
  );
