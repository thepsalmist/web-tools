import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../../../../common/hocs/AsyncContainer';
import withHelp from '../../../../../common/hocs/HelpfulContainer';
import AttentionOverTimeChart from '../../../../../vis/AttentionOverTimeChart';
import { fetchCreateFocusKeywordAttention } from '../../../../../../actions/topicActions';
import DataCard from '../../../../../common/DataCard';
import { getBrandDarkColor } from '../../../../../../styles/colors';

const localMessages = {
  title: { id: 'topic.snapshot.keywords.attention.title', defaultMessage: 'Matching Stories' },
  helpTitle: { id: 'topic.snapshot.keywords.attention.help.title', defaultMessage: 'About Attention' },
  helpText: { id: 'topic.snapshot.keywords.attention.help.text',
    defaultMessage: '<p>This chart shows you the number of stories over time that match your subtopic query.</p>',
  },
  chartExplanation: { id: 'topic.snapshot.keywords.attention.explanation',
    defaultMessage: 'This chart shows you {total} stories that match your subtopic query.',
  },
};

class KeywordSentenceCountPreviewContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { keywords, fetchData } = this.props;
    if (nextProps.keywords !== keywords) {
      fetchData(nextProps.keywords);
    }
  }

  render() {
    const { total, counts, helpButton } = this.props;
    return (
      <DataCard>
        <h2>
          <FormattedMessage {...localMessages.title} />
          {helpButton}
        </h2>
        <p><FormattedMessage {...localMessages.chartExplanation} values={{ total }} /></p>
        <AttentionOverTimeChart
          data={counts}
          height={200}
          lineColor={getBrandDarkColor()}
        />
      </DataCard>
    );
  }
}

KeywordSentenceCountPreviewContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // passed in
  topicId: PropTypes.number.isRequired,
  keywords: PropTypes.string.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  total: PropTypes.number,
  counts: PropTypes.array,
  // from dispath
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.focalSets.create.matchingAttention.fetchStatus,
  total: state.topics.selected.focalSets.create.matchingAttention.total,
  counts: state.topics.selected.focalSets.create.matchingAttention.counts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (keywords) => {
    dispatch(fetchCreateFocusKeywordAttention(ownProps.topicId, { q: keywords }));
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
        KeywordSentenceCountPreviewContainer
      )
    )
  )
);
