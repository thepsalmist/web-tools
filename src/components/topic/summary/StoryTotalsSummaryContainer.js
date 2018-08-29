import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import ActionMenu from '../../common/ActionMenu';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import withSummary from '../../common/hocs/SummarizedVizualization';
import { fetchTopicStoryCounts } from '../../../actions/topicActions';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_LOGGED_IN } from '../../../lib/auth';
import BubbleRowChart from '../../vis/BubbleRowChart';
import { DownloadButton } from '../../common/IconButton';
import { topicDownloadFilename } from '../../util/topicUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import messages from '../../../resources/messages';
import { downloadSvg } from '../../util/svg';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-story-total';

const localMessages = {
  title: { id: 'topic.summary.storyTotals.title', defaultMessage: 'Filtered Story Count' },
  descriptionIntro: { id: 'topic.summary.storyTotals.help.title',
    defaultMessage: '<p>Any filters you choose to apply will focus in on a smaller set of the stories within this topic.  Here you can see how many stories you are looking at, from the total stories within the topic.</p>',
  },
  description: { id: 'topic.summary.storyTotals.help.into',
    defaultMessage: '<p>This bubble chart shows you how many stories from this Topic are included in the filters you have selected.  The "filtered" bubble is the number of stories included in your filters.  The "Total" bubble is the total stories within this topic.</p>',
  },
  filteredLabel: { id: 'topic.summary.storyTotals.filtered', defaultMessage: 'Filtered' },
  totalLabel: { id: 'topic.summary.storyTotals.total', defaultMessage: 'Total' },
};

class StoryTotalsSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps);
    }
  }
  render() {
    const { counts, topicName, filters } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    let content = null;
    if (counts !== null) {
      const data = [  // format the data for the bubble chart help
        {
          value: counts.count,
          fill: getBrandDarkColor(),
          aboveText: formatMessage(localMessages.filteredLabel),
          aboveTextColor: 'rgb(255,255,255)',
          rolloverText: `${formatMessage(localMessages.filteredLabel)}: ${formatNumber(counts.count)} stories`,
        },
        {
          value: counts.total,
          aboveText: formatMessage(localMessages.totalLabel),
          rolloverText: `${formatMessage(localMessages.totalLabel)}: ${formatNumber(counts.total)} stories`,
        },
      ];
      content = (<BubbleRowChart
        data={data}
        domId={BUBBLE_CHART_DOM_ID}
      />);
    }
    return (
      <React.Fragment>
        {content}
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ActionMenu actionTextMsg={messages.downloadOptions}>
              <MenuItem
                className="action-icon-menu-item"
                primaryText={formatMessage(messages.downloadSVG)}
                rightIcon={<DownloadButton />}
                onClick={() => downloadSvg(`${topicDownloadFilename(topicName, filters)}-filtered-story-count`, BUBBLE_CHART_DOM_ID)}
              />
            </ActionMenu>
          </div>
        </Permissioned>
      </React.Fragment>
    );
  }
}

StoryTotalsSummaryContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  topicName: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  counts: PropTypes.object,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.storyTotals.fetchStatus,
  counts: state.topics.selected.summary.storyTotals.counts,
  filters: state.topics.selected.filters,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicStoryCounts(props.topicId, props.filters));
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
      withSummary(localMessages.title, localMessages.descriptionIntro, localMessages.description)(
        withAsyncFetch(
          StoryTotalsSummaryContainer
        )
      )
    )
  );
