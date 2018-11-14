import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ActionMenu from '../../common/ActionMenu';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withSummary from '../../common/hocs/SummarizedVizualization';
import withAttentionAggregation from '../../common/hocs/AttentionAggregation';
import AttentionOverTimeChart from '../../vis/AttentionOverTimeChart';
import { fetchTopicSplitStoryCounts, selectTimeAggregatePeriod } from '../../../actions/topicActions';
import messages from '../../../resources/messages';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { DownloadButton } from '../../common/IconButton';
import { getBrandDarkColor } from '../../../styles/colors';
import { filteredLinkTo, filtersAsUrlParams } from '../../util/location';
// import { PAST_WEEK } from '../../../lib/dateUtil';

const STACKED_VIEW = 0
const LINE_VIEW = 1

const localMessages = {
  title: { id: 'topic.summary.splitStoryCount.title', defaultMessage: 'Attention Over Time' },
  descriptionIntro: { id: 'topic.summary.splitStoryCount.help.title', defaultMessage: '<p>Analyze attention to this topic over time to understand how it is covered. This chart shows the total number of stories that matched your topic query. Spikes in attention can reveal key events.  Plateaus can reveal stable, "normal", attention levels.</p>' },
  downloadCsv: { id: 'topic.summary.splitStoryCount.download', defaultMessage: 'Download daily story count CSV' },
  stackedView: { id: 'topic.summary.splitStoryCount.view.stacked', defaultMessage: 'Stacked Area View' },
  lineView: { id: 'topic.summary.splitStoryCount.view.line', defaultMessage: 'Line View' },
};

class SplitStoryCountSummaryContainer extends React.Component {
  state = {
    view: LINE_VIEW,
  }

  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }

  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/split-story/count.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }

  setView = (nextView) => {
    this.setState({ view: nextView });
  }

  render() {
    const { total, counts } = this.props;
    const stackedAreaView = (
      <div>
        <MenuItem
          className="action-icon-menu-item"
          ddisabled={this.state.view === LINE_VIEW}
          onClick={() => this.setView(LINE_VIEW)}
        >
          <ListItemText><FormattedMessage {...localMessages.lineView} /></ListItemText>
        </MenuItem>
        <MenuItem
          className="action-icon-menu-item"
          disabled={this.state.view === STACKED_VIEW}
          onClick={() => this.setView(STACKED_VIEW)}
        >
          <ListItemText><FormattedMessage {...localMessages.stackedView} /></ListItemText>
        </MenuItem>
      </div>
    );
    return (
      <React.Fragment>
        <AttentionOverTimeChart
          total={total}
          data={counts}
          height={200}
          lineColor={getBrandDarkColor()}
          backgroundColor="#f5f5f5"
          interval={this.props.selectedTimePeriod}
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
              {this.props.attentionViewOptions}
              {stackedAreaView}
            </ActionMenu>
          </div>
        </Permissioned>
      </React.Fragment>
    );
  }
}

SplitStoryCountSummaryContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // passed in
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array, // array of {date: epochMS, count: int]
  // from dispath
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  handleExplore: PropTypes.func.isRequired,

  handleTimePeriodClick: PropTypes.func,
  attentionViewOptions: PropTypes.object.isRequired, // from hoc
  selectedTimePeriod: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.splitStoryCount.fetchStatus,
  total: state.topics.selected.summary.splitStoryCount.total,
  counts: state.topics.selected.summary.splitStoryCount.counts,
  selectedTimePeriod: state.topics.selected.summary.splitStoryCount.selectedTimePeriod,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    dispatch(fetchTopicSplitStoryCounts(props.topicId, props.filters));
  },
  handleExplore: () => {
    const exploreUrl = filteredLinkTo(`/topics/${ownProps.topicId}/attention`, ownProps.filters);
    dispatch(push(exploreUrl));
  },
  handleTimePeriodClick: (timeperiod) => {
    dispatch(selectTimeAggregatePeriod(timeperiod));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withSummary(localMessages.title, localMessages.descriptionIntro, [messages.attentionChartHelpText])(
      withAttentionAggregation(
        withAsyncFetch(
          SplitStoryCountSummaryContainer
        )
      )
    )
  )
);
