import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../../../common/hocs/AsyncContainer';
import withHelp from '../../../../../common/hocs/HelpfulContainer';
import { fetchCreateFocusKeywordStoryCounts } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import BubbleRowChart from '../../../../../vis/BubbleRowChart';
import { getBrandDarkColor } from '../../../../../../styles/colors';

const BUBBLE_CHART_DOM_ID = 'bubble-chart-keyword-preview-story-total';

const localMessages = {
  title: { id: 'topic.snapshot.keywords.storyCount.title', defaultMessage: 'Story Counts' },
  helpTitle: { id: 'topic.snapshot.keywords.storyCount.help.title', defaultMessage: 'About Story Counts' },
  helpText: { id: 'topic.snapshot.keywords.storyCount.help.text',
    defaultMessage: '<p>This is a visualization showing the how many of the stories from the total Topic would be included within this Subtopic.</p>',
  },
  filteredLabel: { id: 'topic.snapshot.keywords.storyCount.matching', defaultMessage: 'Matching Stories' },
  totalLabel: { id: 'topic.snapshot.keywords.storyCount.total', defaultMessage: 'All Stories' },
};

class KeywordStoryCountPreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { keywords, fetchData } = this.props;
    if (nextProps.keywords !== keywords) {
      fetchData(nextProps.keywords);
    }
  }

  render() {
    const { counts, helpButton } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    let content = null;
    if (counts !== null) {
      const data = [ // format the data for the bubble chart help
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
      content = (
        <BubbleRowChart
          data={data}
          domId={BUBBLE_CHART_DOM_ID}
          width={400}
          padding={30}
        />
      );
    }
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        {content}
      </DataCard>
    );
  }
}

KeywordStoryCountPreviewContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  keywords: PropTypes.string.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  counts: PropTypes.object,
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingStoryCounts.fetchStatus,
  counts: state.topics.selected.focalSets.create.matchingStoryCounts.counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (keywords) => {
    dispatch(fetchCreateFocusKeywordStoryCounts(ownProps.topicId, { q: keywords }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.keywords);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withHelp(localMessages.helpTitle, localMessages.helpText)(
      withAsyncFetch(
        KeywordStoryCountPreviewContainer
      )
    )
  )
);
