import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ActionMenu from '../../common/ActionMenu';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withSummary from '../../common/hocs/SummarizedVizualization';
import withAttentionAggregation from '../../common/hocs/AttentionAggregation';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchTopicSplitStoryCounts, fetchTopicTopStoriesOnDates, clearTopicTopStoriesPeaks } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DownloadButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
import { trimToMaxLength } from '../../../lib/stringUtil';

const localMessages = {
  title: { id: 'topic.summary.splitStoryCount.title', defaultMessage: 'Attention Over Time' },
  descriptionIntro: { id: 'topic.summary.splitStoryCount.help.title', defaultMessage: '<p>Analyze attention to this topic over time to understand how it is covered. This chart shows the total number of stories that matched your topic query. Spikes in attention can reveal key events.  Plateaus can reveal stable, "normal", attention levels.</p>' },
  downloadCsv: { id: 'topic.summary.splitStoryCount.download', defaultMessage: 'Download daily story count CSV' },
};

/*
const peaksInTimeSeries = (data, n = 1) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => ((a.count < b.count) ? 1 : -1));
  sortedData = sortedData.slice(0, n);
  return sortedData;
};
*/

class SplitStoryCountSummaryContainer extends React.Component {
  componentDidUpdate(prevProps) {
    const { selectedTimePeriod, handleTimePeriodChange } = this.props;
    if (prevProps.selectedTimePeriod !== selectedTimePeriod) {
      handleTimePeriodChange();
    }
  }

  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/split-story/count.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }

  render() {
    const { total, counts, peaks, selectedTimePeriod, attentionAggregationMenuItems,
      handleDataPointClick } = this.props;
    let annotations = [];
    if (peaks.length > 0) {
      annotations = [{
        labelOptions: {
          shape: 'connector',
          align: 'right',
          justify: false,
          style: {
            fontSize: '1em',
            textOutline: '1px white',
          },
        },
        labels: peaks.map(p => ({
          point: {
            xAxis: 0,
            yAxis: 0,
            x: p.startTimestamp,
            y: p.storyCount,
          },
          text: trimToMaxLength(p.stories[0].title, 60),
        })),
      }];
    }
    return (
      <>
        <AttentionOverTimeChart
          total={total}
          data={counts}
          annotations={annotations}
          height={200}
          lineColor={getBrandDarkColor()}
          backgroundColor="#f5f5f5"
          interval={selectedTimePeriod}
          onDataPointClick={handleDataPointClick}
        />
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ActionMenu actionTextMsg={messages.downloadOptions}>
              <MenuItem
                className="action-icon-menu-item"
                onClick={this.downloadCsv}
              >
                <ListItemText><FormattedMessage {...localMessages.downloadCsv} /></ListItemText>
                <ListItemIcon><DownloadButton /></ListItemIcon>
              </MenuItem>
            </ActionMenu>
            <ActionMenu actionTextMsg={messages.viewOptions}>
              {attentionAggregationMenuItems}
            </ActionMenu>
          </div>
        </Permissioned>
      </>
    );
  }
}

SplitStoryCountSummaryContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  selectedTimePeriod: PropTypes.string.isRequired,
  attentionAggregationMenuItems: PropTypes.array.isRequired, // from hoc
  // passed in
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array, // array of {date: epochMS, count: int]
  peaks: PropTypes.array,
  // from dispath
  handleExplore: PropTypes.func.isRequired,
  handleDataPointClick: PropTypes.func.isRequired,
  handleTimePeriodChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.splitStoryCount.fetchStatus,
  total: state.topics.selected.summary.splitStoryCount.total,
  counts: state.topics.selected.summary.splitStoryCount.counts,
  peaks: state.topics.selected.summary.splitStoryCount.peaks,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleExplore: () => {
    const exploreUrl = filteredLinkTo(`/topics/${ownProps.topicId}/attention`, ownProps.filters);
    dispatch(push(exploreUrl));
  },
  handleDataPointClick: (startDate, endDate, evt, chartObj, point0x, point1x, pointValue) => {
    dispatch(fetchTopicTopStoriesOnDates(ownProps.topicId, {
      ...ownProps.filters,
      sort: 'inlink',
      limit: 5,
      startTimestamp: point0x,
      endTimestamp: point1x,
      storyCount: pointValue,
    }));
  },
  // when time period changes we need to clear the peaks we've annotated, because they aren't there anymore
  handleTimePeriodChange: () => dispatch(clearTopicTopStoriesPeaks()),
});

const fetchAsyncData = (dispatch, props) => {
  dispatch(fetchTopicSplitStoryCounts(props.topicId, props.filters));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withSummary(localMessages.title, localMessages.descriptionIntro, [messages.doesNotIncludeUndateable, messages.attentionChartHelpText])(
      withAttentionAggregation(
        withFilteredAsyncData(fetchAsyncData)(
          SplitStoryCountSummaryContainer
        )
      )
    )
  )
);
