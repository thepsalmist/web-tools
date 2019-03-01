import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { fetchFavoriteTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';

const localMessages = {
  empty: { id: 'topics.favorite.none', defaultMessage: 'You don\'t have any starred topics.  You can star topics to save them here so you can find them more quickly. Click the star icon next to any topic\'s name to add it to this list.' },
};

const FavoriteTopicsContainer = (props) => {
  const { topics, onSetFavorited, onFetchAyncData } = props;
  return (
    <div className="favorite-topics-list">
      <TopicPreviewList
        topics={topics}
        linkGenerator={t => `/topics/${t.topics_id}/summary`}
        onSetFavorited={(id, isFav) => { onSetFavorited(id, isFav); onFetchAyncData(); }}
        emptyMsg={localMessages.empty}
      />
    </div>
  );
};

FavoriteTopicsContainer.propTypes = {
  // from parent
  onSetFavorited: PropTypes.func,
  // from state
  topics: PropTypes.array,
  // from compositonla chain
  intl: PropTypes.object.isRequired,
  onFetchAyncData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.favoriteList.fetchStatus,
  topics: state.topics.favoriteList.topics,
});

const fetchAsyncData = dispatch => dispatch(fetchFavoriteTopicsList());

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      FavoriteTopicsContainer
    )
  )
);
