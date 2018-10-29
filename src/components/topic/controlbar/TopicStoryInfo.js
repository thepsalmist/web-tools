import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import { fetchTopicStoryCounts } from '../../../actions/topicActions';

const localMessages = {
  seedQueryCount: { id: 'topic.state.seedQueryCount', defaultMessage: 'Seed Query Count:' },
  spideredQueryCount: { id: 'topic.summary.timespan', defaultMessage: 'Spidered Query Count:' },
};

const TopicStoryInfo = (props) => {
  const { seedQueryCount, spideredQueryCount } = props;
  return (
    <React.Fragment>
      <p>
        <b><FormattedMessage {...localMessages.seedQueryCount} /></b>
        <code>{seedQueryCount}</code>
        <br />
        <b><FormattedMessage {...localMessages.spideredQueryCount} /></b>
        <code>{spideredQueryCount}</code>
      </p>
    </React.Fragment>
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
    let infoForQuery = {
      q: props.topic.solr_seed_query,
      start_date: props.topic.start_date,
      end_date: props.topic.end_date,
    };
    infoForQuery['collections[]'] = [];
    infoForQuery['sources[]'] = [];

    if ('media_tags' in props.topic) { // in FieldArrays on the form
      infoForQuery['collections[]'] = props.topic.media_tags.map(s => s.tags_id);
      infoForQuery['sources[]'] = props.topic.media_tags.map(s => s.media_id);
    }
    infoForQuery = Object.assign({}, infoForQuery, ...props.filters);
    dispatch(fetchTopicStoryCounts(props.topic.topics_id, infoForQuery ));
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
