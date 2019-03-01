import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
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
  filters: PropTypes.object.isRequired,
  // from store
  fetchStatus: PropTypes.string.isRequired,
  seedQueryCount: PropTypes.number,
  spideredQueryCount: PropTypes.number,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.storyTotals.fetchStatus,
  seedQueryCount: state.topics.selected.summary.storyTotals.counts.count,
  spideredQueryCount: state.topics.selected.summary.storyTotals.counts.total,
});

const fetchAsyncData = (dispatch, { topic, filters }) => {
  let infoForQuery = {
    q: topic.solr_seed_query,
    start_date: topic.start_date,
    end_date: topic.end_date,
  };
  infoForQuery['collections[]'] = [];
  infoForQuery['sources[]'] = [];

  if ('media_tags' in topic) { // in FieldArrays on the form
    infoForQuery['collections[]'] = topic.media_tags.map(s => s.tags_id);
    infoForQuery['sources[]'] = topic.media_tags.map(s => s.media_id);
  }
  infoForQuery = Object.assign({}, infoForQuery, ...filters);
  dispatch(fetchTopicStoryCounts(topic.topics_id, infoForQuery));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withFilteredAsyncData(fetchAsyncData)(
      TopicStoryInfo
    )
  )
);
