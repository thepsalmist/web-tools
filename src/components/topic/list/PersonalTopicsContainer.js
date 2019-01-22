import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { fetchPersonalTopicsList } from '../../../actions/topicActions';
import TopicPreviewList from './TopicPreviewList';
import withPaging from '../../common/hocs/PagedContainer';

const localMessages = {
  empty: { id: 'topics.personal.none', defaultMessage: 'You haven\'t created any topics yet. Explore the public topics, or click the "Create a New Topic" button above to make your own.' },
};

const userIsOwner = (owners, user) => owners.filter(topicUser => topicUser.email === user.email).length > 0;

const topicsUserOwns = (topics, user) => topics.filter(topic => userIsOwner(topic.owners, user));

const PersonalTopicsContainer = (props) => {
  const { topics, onSetFavorited, onFetchAyncData, user, showAll } = props;
  return (
    <div className="personal-topics-list">
      <TopicPreviewList
        topics={(showAll === true) ? topics : topicsUserOwns(topics, user)}
        linkGenerator={t => `/topics/${t.topics_id}/summary`}
        onSetFavorited={(id, isFav) => { onSetFavorited(id, isFav); onFetchAyncData(); }}
        emptyMsg={localMessages.empty}
      />
    </div>
  );
};

PersonalTopicsContainer.propTypes = {
  // from parent
  onSetFavorited: PropTypes.func,
  showAll: PropTypes.bool,
  // from state
  topics: PropTypes.array,
  user: PropTypes.object.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  onFetchAyncData: PropTypes.func.isRequired,
  prevButton: PropTypes.node,
  nextButton: PropTypes.node,
};

const mapStateToProps = state => ({
  user: state.user,
  fetchStatus: state.topics.personalList.fetchStatus,
  topics: state.topics.personalList.topics,
  links: state.topics.personalList.link_ids,
});

const fetchAsyncData = dispatch => dispatch(fetchPersonalTopicsList());

const handlePageChange = (dispatch, props, linkId) => dispatch(fetchPersonalTopicsList(linkId));

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      withPaging(handlePageChange)(
        PersonalTopicsContainer
      )
    )
  )
);
