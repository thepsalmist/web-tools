import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ActionMenu from '../../common/ActionMenu';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import withSummary from '../../common/hocs/SummarizedVizualization';
import withAttentionAggregation from '../../common/hocs/AttentionAggregation';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchTopicSplitStoryCounts, fetchTopicTopStoriesOnDates } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DownloadButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
import { trimToMaxLength } from '../../../lib/stringUtil';
// import { PAST_WEEK } from '../../../lib/dateUtil';

const localMessages = {
  title: { id: 'topic.summary.splitStoryCount.title', defaultMessage: 'Attention Over Time' },
  descriptionIntro: { id: 'topic.summary.splitStoryCount.help.title', defaultMessage: '<p>Analyze attention to this topic over time to understand how it is covered. This chart shows the total number of stories that matched your topic query. Spikes in attention can reveal key events.  Plateaus can reveal stable, "normal", attention levels.</p>' },
  downloadCsv: { id: 'topic.summary.splitStoryCount.download', defaultMessage: 'Download daily story count CSV' },
  labelFacebookPeaks: { id: 'topic.summary.splitStoryCount.labelPeaksFB', defaultMessage: 'Label Peaks with Top Facebook Stories' },
  labelInlinkPeaks: { id: 'topic.summary.splitStoryCount.labelPeaksInlink', defaultMessage: 'Label Peaks with Top Inlinked Stories' },
};

const peaksInTimeSeries = (data, n = 1) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => ((a.count < b.count) ? 1 : -1));
  sortedData = sortedData.slice(0, n);
  return sortedData;
};

class SplitStoryCountSummaryContainer extends React.Component {
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/split-story/count.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }

  render() {
    const { total, counts, peaks, selectedTimePeriod, attentionAggregationMenuItems, handleLabelPeaks } = this.props;
    let annotations = [];
    if (peaks.length > 0) {
      annotations = [{
        labelOptions: {
          shape: 'connector',
          align: 'right',
          justify: false,
          crop: true,
          style: {
            fontSize: '0.8em',
            textOutline: '1px white',
          },
        },
        labels: peaks.map(p => ({
          point: {
            xAxis: 0,
            yAxis: 0,
            x: p.date,
            y: counts.find(d => d.date === p.date).count,
          },
          text: trimToMaxLength(p.stories[0].title, 40),
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
              <Divider />
              <MenuItem
                className="action-icon-menu-item"
                onClick={() => handleLabelPeaks(counts, 'inlink')}
              >
                <ListItemText><FormattedMessage {...localMessages.labelInlinkPeaks} /></ListItemText>
              </MenuItem>
              <MenuItem
                className="action-icon-menu-item"
                onClick={() => handleLabelPeaks(counts, 'facebook')}
              >
                <ListItemText><FormattedMessage {...localMessages.labelFacebookPeaks} /></ListItemText>
              </MenuItem>
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
  handleLabelPeaks: PropTypes.func.isRequired,
  handleTimePeriodClick: PropTypes.func,
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
  handleLabelPeaks: (counts, sort) => {
    const peakDates = peaksInTimeSeries(counts).slice(0, 3).map(d => d.date);
    dispatch(fetchTopicTopStoriesOnDates(ownProps.topicId, {
      ...ownProps.filters,
      sort,
      limit: 5,
      dates: peakDates,
    }));
    return false;
  },
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
