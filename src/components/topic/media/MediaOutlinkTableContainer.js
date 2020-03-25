import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchMediaOutlinks, sortMediaOutlinks } from '../../../actions/topicActions';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import TopicStoryTableContainer from '../TopicStoryTableContainer';

const STORIES_TO_SHOW = 10;

const localMessages = {
  localTitle: { id: 'media.outlinks.table', defaultMessage: 'Top Outlinks' },
};

const MediaOutlinkTableContainer = (props) => {
  const { outlinkedStories, handleSortData } = props;
  return (
    <div>
      <h3><FormattedMessage {...localMessages.localTitle} /></h3>
      <TopicStoryTableContainer stories={outlinkedStories} onChangeSort={handleSortData} />
    </div>
  );
};

MediaOutlinkTableContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  // from parent
  mediaId: PropTypes.number.isRequired,
  // from dispatch
  handleSortData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  outlinkedStories: PropTypes.array,
  sort: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.outlinks.fetchStatus,
  outlinkedStories: state.topics.selected.mediaSource.outlinks.stories,
  sort: state.topics.selected.mediaSource.outlinks.sort,
});

const mapDispatchToProps = dispatch => ({
  handleSortData: sort => dispatch(sortMediaOutlinks(sort)),
});

const fetchAsyncData = (dispatch, props) => {
  const params = {
    ...props.filters,
    sort: props.sort,
    limit: STORIES_TO_SHOW,
  };
  dispatch(fetchMediaOutlinks(props.topicId, props.mediaId, params));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withFilteredAsyncData(fetchAsyncData, ['sort'])(
      MediaOutlinkTableContainer
    )
  )
);
