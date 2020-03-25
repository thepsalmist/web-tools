import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchMediaInlinks, sortMediaInlinks } from '../../../actions/topicActions';
import withFilteredAsyncData from '../FilteredAsyncDataContainer';
import TopicStoryTableContainer from '../TopicStoryTableContainer';

const STORIES_TO_SHOW = 10;

const localMessages = {
  localTitle: { id: 'media.inlinks.table', defaultMessage: 'Top Inlinks' },
};

const MediaInlinkTableContainer = (props) => {
  const { inlinkedStories, handleSortData } = props;
  return (
    <div>
      <h3><FormattedMessage {...localMessages.localTitle} /></h3>
      <TopicStoryTableContainer stories={inlinkedStories} onChangeSort={handleSortData} />
    </div>
  );
};

MediaInlinkTableContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  mediaId: PropTypes.number.isRequired,
  // from dispatch
  handleSortData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  inlinkedStories: PropTypes.array,
  sort: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.mediaSource.inlinks.stories,
  sort: state.topics.selected.mediaSource.inlinks.sort,
});

const mapDispatchToProps = dispatch => ({
  handleSortData: sort => dispatch(sortMediaInlinks(sort)),
});

const fetchAsyncData = (dispatch, props) => {
  const params = {
    ...props.filters,
    sort: props.sort,
    limit: STORIES_TO_SHOW,
  };
  dispatch(fetchMediaInlinks(props.topicId, props.mediaId, params));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withFilteredAsyncData(fetchAsyncData, ['sort'])(
      MediaInlinkTableContainer
    )
  )
);
