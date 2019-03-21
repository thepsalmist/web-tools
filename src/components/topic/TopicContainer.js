import PropTypes from 'prop-types';
import React from 'react';
import { replace } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../common/hocs/AsyncDataContainer';
import TopicHeaderContainer from './TopicHeaderContainer';
import { addNotice } from '../../actions/appActions';
import { selectTopic, fetchTopicSummary, fetchTopicTimespansList, fetchTopicFocalSetsList,
  filterBySnapshot, filterByFocus, filterByTimespan, filterByQuery, updateTopicFilterParsingStatus,
} from '../../actions/topicActions';
import { FILTER_PARSING_ONGOING, FILTER_PARSING_DONE } from '../../reducers/topics/selected/filters';
import PageTitle from '../common/PageTitle';
import { filteredLocation } from '../util/location';
import TopicControlBar from './controlbar/TopicControlBar';
import { getCurrentVersionFromSnapshot } from '../../lib/topicVersionUtil';
import { latestUsableSnapshot } from '../../reducers/topics/selected/snapshots';
import LoadingSpinner from '../common/LoadingSpinner';
import { parseId } from '../../lib/numberUtil';
import withFilteredUrlMaintenance from './versions/FilteredUrlMaintainer';

/*
// when you switch snapshots we need to find the matching timespan in the new snapshot
function findMatchingTimespan(timespan, timespanList) {
  if (timespanList && timespanList.list) {
    return timespanList.list.find(ts => (
      ((ts.period === timespan.period) && (ts.start_date === timespan.start_date) && (ts.end_date === timespan.end_date))
    ));
  }
  return [];
}
*/

/**
 * This is the parent of any topic-specific content. It handles the initial load of the topic info and
 * picks default filters for you (as needed).  Anything further down the react component hierarchy can
 * assume that the filters and topic have been fully loaded.
 */
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
    const currentVersionNum = parseId(getCurrentVersionFromSnapshot(topicInfo, currentVersionId));
    let content = (<LoadingSpinner />);
    if (filters.parsingStatus === FILTER_PARSING_DONE) {
      // pass a handler to all the children so the can set the control bar side content if they need to
      const childrenWithExtraProp = React.Children.map(children, child => React.cloneElement(child, { setSideBarContent: this.setSideBarContent }));
      content = (
        <React.Fragment>
          <TopicControlBar
            {...this.props}
            topicId={topicId}
            topic={topicInfo}
            sideBarContent={this.state.sideBarContent}
            // implements handleRenderFilters and evaluates showFilters
            // setupJumpToExplorer={setupJumpToExplorer} // defined in child Component VersionReady
          />
          {childrenWithExtraProp}
        </React.Fragment>
      );
    }
    return (
      <div className="topic-container">
        <PageTitle value={topicInfo.name} />
        <TopicHeaderContainer topicId={topicId} topicInfo={topicInfo} currentVersion={currentVersionNum} filters={filters} />
        {content}
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
  dispatch: PropTypes.func.isRequired,
  // from dispatch
  addAppNotice: PropTypes.func.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  topicInfo: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseId(ownProps.params.topicId),
  currentVersionId: parseId(ownProps.location.query.snapshotId),
});

const mapDispatchToProps = dispatch => ({
  addAppNotice: (info) => {
    dispatch(addNotice(info));
  },
});

const pickDefaultTimespan = (dispatch, timespanList) => {
  // async handler after promise returns - pick the first timespan as the default (this is the overall one)
  let defaultTimespanId;
  if (timespanList.length > 0) {
    defaultTimespanId = timespanList[0].timespans_id;
  }
  return defaultTimespanId;
};

const pickDefaultFilters = (dispatch, topicId, snapshotsList, location) => {
  // async handler after snapshot data arrives - if no snapshot specified, default to the
  // latest snapshot or the first snapshot if none is usable
  let urlNeedsUpdate = false;
  let currentSnapshotId = parseId(location.query.snapshotId);
  if (currentSnapshotId === null) {
    let defaultSnapshotId = null;
    if (snapshotsList.length > 0) {
      const firstSnapshot = snapshotsList[0];
      const latestUsable = latestUsableSnapshot(snapshotsList);
      defaultSnapshotId = latestUsable ? latestUsable.snapshots_id : firstSnapshot.snapshots_id;
    }
    dispatch(filterBySnapshot(defaultSnapshotId)); // save that to state
    currentSnapshotId = defaultSnapshotId;
    urlNeedsUpdate = true; // we updaed the snapshotId, so we have to update the URL
  }
  dispatch(filterBySnapshot(currentSnapshotId));
  // fire off a request to load the focal sets and foci
  const currentFocusId = parseId(location.query.focusId);
  if (currentSnapshotId) {
    dispatch(fetchTopicFocalSetsList(topicId, { snapshotId: currentSnapshotId }))
      .then(() => {
        dispatch(filterByFocus(currentFocusId));
        // now load up timespans for the snapshot we are using (default or not)
        dispatch(fetchTopicTimespansList(topicId, currentSnapshotId, { focusId: currentFocusId }))
          .then((response) => {
            // if no timespan specified, default to overall
            let currentTimespanId = parseId(location.query.timespanId);
            if (currentTimespanId === null) {
              currentTimespanId = pickDefaultTimespan(dispatch, response.list);
              urlNeedsUpdate = true; // we updaed the timespanId, so we have to update the URL
            }
            dispatch(filterByTimespan(currentTimespanId));
            // and save the q filter if there is one
            dispatch(filterByQuery(location.query.q));
            // now that all the filtres have been deaulted correctly, update the URL
            if (urlNeedsUpdate) { // only i we need to so we don't get extra PUSH commands
              const newLocation = filteredLocation(location, {
                snapshotId: currentSnapshotId,
                timespanId: currentTimespanId,
                focusId: null,
                q: location.query.q,
              });
              dispatch(replace(newLocation)); // do a replace, not a push here so the non-snapshot url isn't in the history
            }
            // and mark that we are done parsing filters so we can render
            dispatch(updateTopicFilterParsingStatus(FILTER_PARSING_DONE));
          });
      });
  }
};

const fetchAsyncData = (dispatch, { params, location }) => {
  // pick this topic id
  dispatch(selectTopic(params.topicId));
  // mark that we are startin the complicated async-driven parsing of filter vaules
  dispatch(updateTopicFilterParsingStatus(FILTER_PARSING_ONGOING));
  // now get the topic info, and once you have it set the default filters
  dispatch(fetchTopicSummary(params.topicId))
    .then(results => pickDefaultFilters(dispatch, params.topicId, results.snapshots.list, location));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      withFilteredUrlMaintenance(
        TopicContainer
      )
    )
  )
);
