import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchTopicStoryCounts } from '../../../actions/topicActions';

const localMessages = {
  seedQueryCount: { id: 'topic.state.seedQueryCount', defaultMessage: 'Seed Query Count: {count}' },
  spideredQueryCount: { id: 'topic.summary.timespan', defaultMessage: 'Spidered Query Count: {count}' },
};

const TopicStoryInfo = (props) => {
  const { seedQueryCount, spideredQueryCount } = props;
  return (
    <FormattedMessage {...localMessages.seedQueryCount} values={{ count: seedQueryCount }} />
    <FormattedMessage {...localMessages.spideredQueryCount} values={{ count: spideredQueryCount }} />
  );
};

TopicStoryInfo.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  // from parent
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  seedQueryCount: PropTypes.number,
  spideredQueryCount: PropTypes.number,
  // from state
  fetchStatus: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.storyTotals.fetchStatus,
  seedQueryCount: state.topics.selected.summary.storyTotals.counts.count,
  spideredQueryCount: state.topics.selected.summary.storyTotals.counts.total,
});

const mapDispatchToProps = dispatch => ({
  fetchData: (props) => {
    dispatch(fetchTopicStoryCounts(props.topic.topics_id, props.filters));
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
    withAsyncFetch(
      TopicStoryInfo
    )
  )
);
