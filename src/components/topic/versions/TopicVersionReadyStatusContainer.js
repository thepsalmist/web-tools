import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { filteredLinkTo } from '../../util/location';
import TopicFilterBar from '../controlbar/TopicFilterBar';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import LoadingSpinner from '../../common/LoadingSpinner';
import { ExploreButton } from '../../common/IconButton';
import { LEVEL_WARNING } from '../../common/Notice';
import { filterByFocus, filterByQuery, filterByTimespan, fetchTopicFocalSetsList, fetchFocalSetDefinitions, setTopicNeedsNewSnapshot } from '../../../actions/topicActions';
import { addNotice } from '../../../actions/appActions';
import { urlToExplorerQuery } from '../../../lib/urlUtil';
import { nullOrUndefined } from '../../../lib/formValidators';

const localMessages = {
  topicRunning: { id: 'topic.topicRunning', defaultMessage: 'We are scraping the web for all the stories in include in your topic.' },
  filterTopic: { id: 'topic.filter', defaultMessage: 'Filter this Topic' },
  summaryMessage: { id: 'topic.summary', defaultMessage: 'You need to generate a new version {url}' },
};

class TopicVersionReadyStatusContainer extends React.Component {
  setupJumpToExplorer() {
    const { selectedTimespan, topicInfo, filters } = this.props;
    // set up links to jump to other tools
    if (selectedTimespan) {
      const queryName = `${topicInfo.name}`;
      let queryKeywords = `timespans_id:${filters.timespanId} `;
      if (filters.q && filters.q.length > 0) {
        queryKeywords += ` AND ${filters.q}`;
      }
      const args = [
        queryName,
        queryKeywords,
        [],
        [],
        selectedTimespan.start_date.substr(0, 10),
        selectedTimespan.end_date.substr(0, 10),
      ];
      const explorerUrl = urlToExplorerQuery(...args);
      // const explorerUrl = urlToExplorerQuery(...args);
      return (
        <span className="jumps">
          <a target="top" href={explorerUrl}>
            <ExploreButton />
            <FormattedMessage {...localMessages.jumpToExplorer} />
          </a>
        </span>
      );
    }
    return null;
  }

  hasUsableSnapshot() {
    const { snapshots } = this.props;
    const hasUsableSnapshot = snapshots.filter(d => d.isUsable);
    return (hasUsableSnapshot.length > 0);
  }

  filtersAreSet() { // use this or
    const { topicId, filters } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }

  render() {
    const { children, topicId, filters, setSideBarContent, location } = this.props;
    let childContent = null;
    // let timespanContent = null;
    // if ready, load subtopic filtering capability and timespan info
    // const timespanControls = <TimespanSelectorContainer topicId={topicId} location={location} filters={filters} />;
    if (this.filtersAreSet()) {
      // show spinner until there is a valid timespan
      if (filters.timespanId) {
        childContent = children; // summary info
      } else {
        childContent = <LoadingSpinner />;
      }
    }
    return (
      <div>
        <div className="sub">
          <TopicFilterBar topicId={topicId} setSideBarContent={setSideBarContent} location={location} />
          {childContent}
        </div>
      </div>
    );
  }
}

TopicVersionReadyStatusContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchStatusInfo: PropTypes.string,
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  snapshots: PropTypes.array.isRequired,
  snapshotId: PropTypes.number,
  // from state
  needsNewSnapshot: PropTypes.bool,
  selectedTimespan: PropTypes.object,
  // from dispatch
  onFetchAyncData: PropTypes.func.isRequired,
  // from merge
  goToUrl: PropTypes.func.isRequired,
  setSideBarContent: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  params: ownProps.params,
  snapshotId: state.topics.selected.filters.snapshotId,
  snapshots: state.topics.selected.snapshots.list,
  selectedTimespan: state.topics.selected.timespans.selected,
});

/**
 * Return true if there are focal set changes that require a new snapshot
 */
function pendingFocalSetDefinitions(definitions, focalSets) {
  // has match?
  const eachHasMatch = definitions.map((setDef) => {
    // for each focal set definition make sure a set exists
    const matchingSet = focalSets.find(set => setDef.name === set.name && setDef.description === set.description);
    if (matchingSet) {
      // make sure length is same (ie. no deleted defs)
      if (matchingSet.foci.length !== setDef.focus_definitions.length) {
        return false;
      }
      // for each focus definined make sure a focus exists in that set
      const macthingFoci = setDef.focus_definitions.map((def) => {
        const matchingFocus = matchingSet.foci.find(focus => def.name === focus.name && def.query === focus.query && def.description === focus.description);
        return matchingFocus !== undefined;
      });
      return !macthingFoci.includes(false);
    }
    return false;
  });
  return eachHasMatch.includes(false);
}

function latestSnapshotIsRunning(snapshots) {
  const latestSnapshot = snapshots[0];
  return (latestSnapshot.state === 'running') || ((latestSnapshot.state === 'completed') && (latestSnapshot.searchable === 0));
}

const mapDispatchToProps = dispatch => ({
  redirectToUrl: (url, filters) => dispatch(push(filteredLinkTo(url, filters))),
});

const fetchAsyncData = (dispatch, { topicId, snapshotId, snapshots, location, intl }) => {
  const { query } = location;
  if (location.query.focusId) {
    dispatch(filterByFocus(query.focusId));
  }
  if (location.query.timespanId) {
    dispatch(filterByTimespan(query.timespanId));
  }
  if (location.query.q) {
    dispatch(filterByQuery(query.q));
  }
  if (!nullOrUndefined(topicId) && !nullOrUndefined(snapshotId)) {
    // here we want to determine if the topic needs a new snapshot and let everything know
    dispatch(fetchTopicFocalSetsList(topicId, { snapshotId }))
      .then((focalSets) => {
        dispatch(fetchFocalSetDefinitions(topicId))
          .then((focalSetDefinitions) => {
            if (pendingFocalSetDefinitions(focalSetDefinitions, focalSets) && !latestSnapshotIsRunning(snapshots)) {
              dispatch(setTopicNeedsNewSnapshot(true));
              dispatch(addNotice({
                level: LEVEL_WARNING,
                htmlMessage: intl.formatHTMLMessage(localMessages.summaryMessage, {
                  url: `#/topics/${topicId}/snapshot/generate`,
                }),
              }));
            }
          });
      });
  }
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    goToUrl: url => dispatchProps.redirectToUrl(url, ownProps.filters),
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters.snapshotId, stateProps.snapshots);
    },
  });
}

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    withAsyncData(fetchAsyncData, ['snapshotId', 'timespanId'])(
      TopicVersionReadyStatusContainer
    )
  )
);
