import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchMediaInlinks, sortMediaInlinks } from '../../../actions/topicActions';
import withAsyncFetch from '../../common/hocs/AsyncContainer';
import TopicStoryTable from '../TopicStoryTable';

const STORIES_TO_SHOW = 10;

const localMessages = {
  localTitle: { id: 'media.inlinks.table', defaultMessage: 'Top Inlinks' },
};

class MediaInlinkTableContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { fetchData, filters, sort } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }

  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  }

  render() {
    const { inlinkedStories, topicId, showTweetCounts } = this.props;
    return (
      <div>
        <h3><FormattedMessage {...localMessages.localTitle} /></h3>
        <TopicStoryTable stories={inlinkedStories} showTweetCounts={showTweetCounts} topicId={topicId} onChangeSort={this.onChangeSort} />
      </div>
    );
  }
}

MediaInlinkTableContainer.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  mediaId: PropTypes.number.isRequired,
  // from mergeProps
  asyncFetch: PropTypes.func.isRequired,
  // from fetchData
  fetchData: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  sort: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  inlinkedStories: PropTypes.array,
  showTweetCounts: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.mediaSource.inlinks.fetchStatus,
  inlinkedStories: state.topics.selected.mediaSource.inlinks.stories,
  sort: state.topics.selected.mediaSource.inlinks.sort,
  filters: state.topics.selected.filters,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (stateProps) => {
    const params = {
      ...stateProps.filters,
      sort: stateProps.sort,
      limit: STORIES_TO_SHOW,
    };
    dispatch(fetchMediaInlinks(ownProps.topicId, ownProps.mediaId, params));
  },
  sortData: (sort) => {
    dispatch(sortMediaInlinks(sort));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(stateProps);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncFetch(
      MediaInlinkTableContainer
    )
  )
);
