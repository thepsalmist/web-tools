import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { fetchPublicTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';
import { TOPIC_SNAPSHOT_STATE_COMPLETED } from '../../../reducers/topics/selected/snapshots';

const localMessages = {
  empty: { id: 'topics.public.none', defaultMessage: 'There are no public topics for you to explore right now.' },
};

const PublicTopicsContainer = (props) => {
  const { topics, onSetFavorited, isLoggedIn, onFetchAyncData } = props;
  return (
    <div className="public-topics-list">
      <TopicPreviewList
        topics={topics.filter(t => t.state === TOPIC_SNAPSHOT_STATE_COMPLETED)}
        linkGenerator={(t) => {
          if (isLoggedIn) {
            return `/topics/${t.topics_id}/summary`;
          }
          return `/topics/public/${t.topics_id}/summary`;
        }}
        onSetFavorited={(id, isFav) => { onSetFavorited(id, isFav); onFetchAyncData(); }}
        emptyMsg={localMessages.empty}
        hideState
      />
    </div>
  );
};

PublicTopicsContainer.propTypes = {
  // from parent
  onSetFavorited: PropTypes.func,
  // from state
  topics: PropTypes.array,
  isLoggedIn: PropTypes.bool.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  onFetchAyncData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.publicList.fetchStatus,
  topics: state.topics.publicList.topics,
  isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchPublicTopicsList());
  },
});

const fetchAsyncData = dispatch => dispatch(fetchPublicTopicsList());

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      PublicTopicsContainer
    )
  )
);
