import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib';
import { fetchTopicSplitStoryCounts, fetchTopicFocalSetSplitStoryCounts } from '../../../actions/topicActions';
import { asyncContainerize } from '../../common/hocs/AsyncContainer';
import DataCard from '../../common/DataCard';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import PackedBubbleChart from '../../vis/PackedBubbleChart';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';
import { downloadSvg } from '../../util/svg';

const localMessages = {
  overallSeries: { id: 'topic.attention.series.overall', defaultMessage: 'Whole Topic' },
  bubbleChartTitle: { id: 'topic.attention.bubbleChart.title', defaultMessage: 'Total Stories in Each Subtopic' },
  lineChartTitle: { id: 'topic.attention.lineChart.title', defaultMessage: 'Total Stories over Time in Each Subtopic' },
};

const SECS_PER_DAY = 1000 * 60 * 60 * 24;
const COLORS = d3.schemeCategory10;
const BUBBLE_CHART_DOM_ID = 'total-attention-bubble-chart';
const TOP_N_LABELS_TO_SHOW = 3; // only the top N bubbles will get a label visible on them (so the text is readable)

function dataAsSeries(data) {
  // clean up the data
  const dates = data.map(d => d.date);
  // turning variable time unit into days
  const intervalMs = (dates[1] - dates[0]);
  const intervalDays = intervalMs / SECS_PER_DAY;
  const values = data.map(d => Math.round(d.count / intervalDays));
  return { values, intervalMs, start: dates[0] };
}

class FociAttentionComparisonContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { selectedFocalSetId, filters, fetchData } = this.props;
    if ((nextProps.selectedFocalSetId !== selectedFocalSetId) || (nextProps.filters.timespanId !== filters.timespanId)) {
      fetchData(nextProps.topicId, nextProps.selectedFocalSetId, nextProps.filters);
    }
  }

  render() {
    const { foci, overallTotal, overallCounts } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    // stich together bubble chart data
    let bubbleData = [];
    if (foci !== undefined && foci.length > 0) {
      bubbleData = [
        ...foci.sort((a, b) => b.total - a.total).map((focus, idx) => ({
          value: focus.total,
          centerText: (idx < TOP_N_LABELS_TO_SHOW) ? focus.name : null,
          rolloverText: `${focus.name}: ${formatNumber(focus.total)}`,
          fill: COLORS[idx + 1],
        })),
        {
          value: overallTotal,
          centerText: formatMessage(localMessages.overallSeries),
          rolloverText: `${formatMessage(localMessages.overallSeries)}: ${formatNumber(overallTotal)}`,
          fill: COLORS[0],
        },
      ];
    }
    // stich together line chart data
    const overallData = dataAsSeries(overallCounts); // now add a series for the whole thing
    let series = [];
    if (foci !== undefined) {
      series = [
        ...foci.map((focus, idx) => { // add series for all the foci
          const data = dataAsSeries(focus.counts);
          return {
            id: idx,
            name: focus.name,
            data: data.values,
            pointStart: data.start,
            pointInterval: data.intervalMs,
            color: COLORS[idx + 1],
          };
        }),
        {
          id: 9999,
          name: formatMessage(localMessages.overallSeries),
          data: overallData.values,
          pointStart: overallData.start,
          pointInterval: overallData.intervalMs,
          color: COLORS[0],
        },
      ];
    }
    return (
      <div>
        <Row>
          <Col lg={12}>
            <DataCard>
              <h2><FormattedMessage {...localMessages.lineChartTitle} /></h2>
              <AttentionOverTimeChart series={series} height={300} />
            </DataCard>
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <DataCard>
              <div className="actions">
                <DownloadButton
                  tooltip={formatMessage(messages.download)}
                  onClick={() => downloadSvg(BUBBLE_CHART_DOM_ID)}
                />
              </div>
              <h2><FormattedMessage {...localMessages.bubbleChartTitle} /></h2>
              <PackedBubbleChart
                data={bubbleData}
                height={400}
                domId={BUBBLE_CHART_DOM_ID}
              />
            </DataCard>
          </Col>
        </Row>
      </div>
    );
  }
}

FociAttentionComparisonContainer.propTypes = {
  // from parent
  filters: PropTypes.object.isRequired,
  selectedFocalSetId: PropTypes.number.isRequired,
  topicId: PropTypes.number.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  foci: PropTypes.array.isRequired,
  overallTotal: PropTypes.number.isRequired,
  overallCounts: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.attention.fetchStatus,
  foci: state.topics.selected.attention.foci,
  overallTotal: state.topics.selected.summary.splitStoryCount.total,
  overallCounts: state.topics.selected.summary.splitStoryCount.counts,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (topicId, focalSetId, filters) => {
    if (topicId !== null) {
      if ((focalSetId !== null) && (focalSetId !== undefined)) {
        // fetch the total counts, then counts for each foci
        dispatch(fetchTopicSplitStoryCounts(topicId, filters))
          .then(() => dispatch(fetchTopicFocalSetSplitStoryCounts(topicId, focalSetId, filters)));
      }
    }
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.selectedFocalSetId, ownProps.filters);
    },
  });
}

export default
connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  asyncContainerize(
    injectIntl(
      FociAttentionComparisonContainer
    )
  )
);
