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
import TopicControlBar from './controlbar/TopicControlBar';
import { getCurrentVersionFromSnapshot } from '../../lib/topicVersionUtil';

class TopicContainer extends React.Component {
  constructor() {
    super();
    this.setSideBarContent = this.setSideBarContent.bind(this);
  }

  state = {
    sideBarContent: null,
  };

  setSideBarContent(sideBarContent) {
    this.setState({ sideBarContent });
  }

  render() {
    const { children, topicInfo, topicId, filters, currentVersionId } = this.props;
    // show a big error if there is one to show
    const childrenWithExtraProp = React.Children.map(children, child => React.cloneElement(child, { setSideBarContent: this.setSideBarContent }));
    const currentVersionNum = parseInt(getCurrentVersionFromSnapshot(topicInfo, currentVersionId), 10);
    const controlbar = (
      <TopicControlBar
        {...this.props}
        topicId={topicId}
        topic={topicInfo}
        sideBarContent={this.state.sideBarContent}
        // implements handleRenderFilters and evaluates showFilters
        // setupJumpToExplorer={setupJumpToExplorer} // defined in child Component VersionReady
      />
    );
    return ( // running or complete
      <div className="topic-container">
        <PageTitle value={topicInfo.name} />
        <TopicHeaderContainer topicId={topicId} topicInfo={topicInfo} currentVersion={currentVersionNum} filters={filters} />
        {controlbar}
        {childrenWithExtraProp}
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
  currentVersionId: PropTypes.number,
  // from dispatch
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
  currentVersionId: parseInt(ownProps.location.query.snapshotId, 10),
});

const mapDispatchToProps = dispatch => ({
  addAppNotice: (info) => {
    dispatch(addNotice(info));
  },
  goToUrl: (url) => {
    dispatch(push(url));
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
