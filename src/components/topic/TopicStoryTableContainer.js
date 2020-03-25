import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import TopicStoryTable from './TopicStoryTable';
import { isUrlSharingFocalSet } from '../../reducers/topics/selected/focalSets/focalSets';

/**
 * Simple wrapper around TopicStoryTable to pull in some stuff from state (so the components that use
 * TopicStoryTable don't need to pass it in). This just passses along all the other props so maintenance
 * cost is low.
 */
const TopicStoryTableContainer = (props) => (
  <TopicStoryTable {...props} />
);

TopicStoryTableContainer.propTypes = {
  // from state
  showTweetCounts: PropTypes.bool.isRequired,
  topicId: PropTypes.number.isRequired,
  showInlinksOutlinks: PropTypes.bool.isRequired,
  showAuthorCount: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  // show tweet counts if the user has a crimson hexagon id on the topic (to deptecate?)
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
  // only show the author count if the user is in a "url sharing" focus
  showAuthorCount: (state.topics.selected.filters.focusId !== null) && isUrlSharingFocalSet(state.topics.selected.timespans.selected.focal_set),
  // hide inlinks and outlinks when the user has a "url sharing" focus selected
  showInlinksOutlinks: (state.topics.selected.filters.focusId === null) || !isUrlSharingFocalSet(state.topics.selected.timespans.selected.focal_set),
});

export default (
  connect(mapStateToProps)(
    TopicStoryTableContainer
  )
);
