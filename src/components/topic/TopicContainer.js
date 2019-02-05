import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../common/hocs/AsyncDataContainer';
import TopicHeaderContainer from './TopicHeaderContainer';
import { addNotice } from '../../actions/appActions';
import { selectTopic, fetchTopicSummary } from '../../actions/topicActions';
import PageTitle from '../common/PageTitle';

class TopicContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { topicId, topicInfo, asyncFetch } = this.props;
    // if they edited the topic, or the topic changed then reload (unless it is just a isFav change)
    let topicInfoHasChanged = false;
    Object.keys(topicInfo).forEach((key) => {
      if ((key !== 'isFavorite') && (topicInfo[key] !== nextProps.topicInfo[key])) {
        topicInfoHasChanged = true;
      }
    });
    if (topicInfoHasChanged || (nextProps.topicId !== topicId)) {
      asyncFetch();
    }
  }

  render() {
    const { children, topicInfo, topicId, filters } = this.props;
    // show a big error if there is one to show
    return ( // running or complete
      <div className="topic-container">
        <PageTitle value={topicInfo.name} />
        <TopicHeaderContainer topicId={topicId} topicInfo={topicInfo} filters={filters} />
        {children}
      </div>
    );
  }
}

TopicContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  addAppNotice: PropTypes.func.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  topicInfo: PropTypes.object,
  goToUrl: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.params.topicId, 10),
});

const mapDispatchToProps = dispatch => ({
  addAppNotice: (info) => {
    dispatch(addNotice(info));
  },
  goToUrl: (url) => {
    dispatch(push(url));
  },
  asyncFetch: () => {
  },
});

const fetchAsyncData = (dispatch, { params }) => {
  dispatch(selectTopic(params.topicId));
  dispatch(fetchTopicSummary(params.topicId));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      TopicContainer
    )
  )
);
