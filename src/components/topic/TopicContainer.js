import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../common/hocs/AsyncDataContainer';
import TopicHeaderContainer from './TopicHeaderContainer';
import { addNotice } from '../../actions/appActions';
import { selectTopic, fetchTopicSummary, fetchTopicTimespansList,
  filterBySnapshot, filterByFocus, filterByTimespan, filterByQuery } from '../../actions/topicActions';
import { emptyString } from '../../lib/formValidators';
import PageTitle from '../common/PageTitle';
import TopicControlBar from './controlbar/TopicControlBar';
import { getCurrentVersionFromSnapshot } from '../../lib/topicVersionUtil';
import { latestUsableSnapshot } from '../../reducers/topics/selected/snapshots';

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

const pickDefaultTimespan = (dispatch, timespanList) => {
  // pick the first timespan as the default (this is the overall one)
  let defaultTimespanId;
  if (timespanList.length > 0) {
    defaultTimespanId = timespanList[0].timespans_id;
  }
  dispatch(filterByTimespan(defaultTimespanId));
};

const pickDefaultFilters = (dispatch, topicId, snapshotsList, location) => {
  // if no snapshot specified, default to the latest snapshot or the first snapshot if none is usable
  let currentSnapshotId;
  const currentFocusId = location.query.focusId;
  if (emptyString(location.query.snapshotId)) {
    let defaultSnapshotId = null;
    if (snapshotsList.length > 0) {
      const firstSnapshot = snapshotsList[0];
      const latestUsable = latestUsableSnapshot(snapshotsList);
      defaultSnapshotId = latestUsable ? latestUsable.snapshots_id : firstSnapshot.snapshots_id;
    }
    dispatch(filterBySnapshot(defaultSnapshotId)); // save that to state
    currentSnapshotId = defaultSnapshotId;
  }
  // now load up timespans for the snapshot we are using (default or not)
  if (currentSnapshotId) {
    dispatch(fetchTopicTimespansList(topicId, currentSnapshotId, { focusId: currentFocusId }))
      .then((response) => {
        // if no timespan specified, default to overall
        if (emptyString(location.query.timespanId)) {
          pickDefaultTimespan(dispatch, response.list);
        }
      });
  }
};

const fetchAsyncData = (dispatch, { params, location }) => {
  // first set all the default values based on the URL
  dispatch(selectTopic(params.topicId));
  if (location.query.snapshotId) {
    dispatch(filterBySnapshot(location.query.snapshotId));
  }
  if (location.query.focusId) {
    dispatch(filterByFocus(location.query.focusId));
  }
  if (location.query.timespanId) {
    dispatch(filterByTimespan(location.query.timespanId));
  }
  if (location.query.q) {
    dispatch(filterByQuery(location.query.q));
  }
  // now get the topic info, and once you have it set the default filters
  dispatch(fetchTopicSummary(params.topicId))
    .then(results => pickDefaultFilters(dispatch, params.topicId, results.snapshots.list, location));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      TopicContainer
    )
  )
);
