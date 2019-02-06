import PropTypes from 'prop-types';
import React from 'react';
import { replace } from 'react-router-redux';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { filteredLocation, urlWithFilters } from '../util/location';
import withAsyncData from '../common/hocs/AsyncDataContainer';
import LoadingSpinner from '../common/LoadingSpinner';
import TopicFilterControlBar from './controlbar/TopicFilterControlBar';
import { addNotice } from '../../actions/appActions';
import { snapshotIsUsable, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR } from '../../reducers/topics/selected/snapshots';
import { ErrorNotice, LEVEL_INFO, LEVEL_WARNING, LEVEL_ERROR } from '../common/Notice';
import { filterBySnapshot, filterByTimespan, filterByFocus, filterByQuery } from '../../actions/topicActions';
import * as fetchConstants from '../../lib/fetchConstants';

const localMessages = {
  exceededStories: { id: 'topics.summary.exceededStories', defaultMessage: 'Your topic has collected more than the 100,000 story limit! You\'ll need to make a new topic with fewer seed stories if you want to investigate this.  Email us at support@mediacloud.org if you need help narrowing down your query.' },
  noUsableSnapshot: { id: 'topics.summary.noUsableSnapshot', defaultMessage: 'Error in topic generation. More info on the way. No usable snapshots.' },
  snapshotBuilderLink: { id: 'needSnapshot.snapshotBuilderLink', defaultMessage: 'Visit the Snapshot Builder for details.' },
  hasAnError: { id: 'topic.hasError', defaultMessage: 'Sorry, this topic has an error!' },
  spiderQueued: { id: 'topic.spiderQueued', defaultMessage: 'This topic is in the queue for spidering stories.  Please reload after a bit to see if it has started spidering.' },
  queueAge: { id: 'topic.spiderQueuedAge', defaultMessage: 'In the {queueName} queue since {lastUpdated}' },
  snapshotQueued: { id: 'snapshotGenerating.warning.queued', defaultMessage: 'We will start creating the new snapshot soon. Please reload this page in a few hours to check if your data is ready.' },
  snapshotRunning: { id: 'snapshotGenerating.warning.running', defaultMessage: 'We are creating a new snapshot right now. Please reload this page in a few hours to check if your data is ready.' },
  snapshotImporting: { id: 'snapshotGenerating.warning.importing', defaultMessage: 'We are importing the new snapshot now. Please reload this page in a few hours to check if your data is ready.' },
  snapshotFailed: { id: 'snapshotFailed.warning', defaultMessage: 'We tried to generate a new snapshot, but it failed.' },
  topicRunning: { id: 'topic.topicRunning', defaultMessage: 'We are scraping the web for all the stories in include in your topic.' },
  notUsingLatestSnapshot: { id: 'topic.notUsingLatestSnapshot', defaultMessage: 'You are not using the latest snapshot!  If you are not doing this on purpose, <a href="{url}">switch to the latest snapshot</a> to get the best data.' },
  otherError: { id: 'topic.state.error.otherError', defaultMessage: 'Sorry, this topic has an error.  It says it is "{state}".' },
  otherErrorInstructions: { id: 'topic.state.error.otherErrorInstructions', defaultMessage: 'Email us at support@mediacloud.org if you have questions' },

};

class FilteredTopicContainer extends React.Component {
  hasUsableSnapshot() {
    const { snapshots } = this.props;
    const hasUsableSnapshot = snapshots.filter(d => d.isUsable);
    return (hasUsableSnapshot.length > 0);
  }

  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }

  render() {
    const { children, location, topicId, topicInfo, filters, fetchStatusInfo,
      fetchStatusSnapshot } = this.props;
    let subContent = null;
    // If the generation process is still ongoing, ask the user to wait a few minutes
    if (this.filtersAreSet()) {
      let childContent;
      // show spinner until there is a valid timespan
      if (filters.timespanId) {
        childContent = children;
      } else {
        childContent = <LoadingSpinner />;
      }
      subContent = (
        <div>
          <TopicFilterControlBar
            topicId={topicId}
            topic={topicInfo}
            location={location}
            filters={filters}
          />
          {childContent}
        </div>
      );
    } else if (fetchStatusInfo !== fetchConstants.FETCH_SUCCEEDED
      && fetchStatusSnapshot !== fetchConstants.FETCH_SUCCEEDED) {
      // how to distinguish between fetch-ongoing and a generating snapshot?
      subContent = <LoadingSpinner />;
    } else if (fetchStatusInfo === fetchConstants.FETCH_SUCCEEDED
      && fetchStatusSnapshot === fetchConstants.FETCH_INVALID
      && !this.hasUsableSnapshot()) {
      // how to distinguish between fetch-ongoing and a generating snapshot?
      if (topicInfo && topicInfo.message) {
        if (topicInfo.message.includes('exceeds')) {
          subContent = (
            <ErrorNotice><FormattedHTMLMessage {...localMessages.exceededStories} /></ErrorNotice>
          );
        }
        subContent = (
          <ErrorNotice><FormattedHTMLMessage {...localMessages.otherError} /></ErrorNotice>
        );
      }
    }
    return (
      subContent,
      children
    );
  }
}

FilteredTopicContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchStatusInfo: PropTypes.string,
  fetchStatusSnapshot: PropTypes.string,
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  snapshots: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  fetchStatusSnapshot: state.topics.selected.snapshots.fetchStatus,
  topicInfo: state.topics.selected.info,
  params: ownProps.params,
  snapshots: state.topics.selected.snapshots.list,
});

const fetchAsyncData = (dispatch, { topicInfo, location, intl }) => {
  // get filters
  const { query } = location;
  const { snapshotId } = query;
  if (snapshotId) {
    dispatch(filterBySnapshot(query.snapshotId));
  }
  if (location.query.focusId) {
    dispatch(filterByFocus(query.focusId));
  }
  if (location.query.timespanId) {
    dispatch(filterByTimespan(query.timespanId));
  }
  if (location.query.q) {
    dispatch(filterByQuery(query.q));
  }
  switch (topicInfo.state) {
    case TOPIC_SNAPSHOT_STATE_QUEUED:
      dispatch(addNotice({
        level: LEVEL_INFO,
        message: intl.formatMessage(localMessages.spiderQueued),
        details: intl.formatMessage(localMessages.queueAge, {
          queueName: topicInfo.job_queue,
          lastUpdated: topicInfo.spiderJobs[0].last_updated,
        }),
      }));
      break;
    case TOPIC_SNAPSHOT_STATE_RUNNING:
      dispatch(addNotice({
        level: LEVEL_INFO,
        message: intl.formatMessage(localMessages.topicRunning),
        details: topicInfo.message,
      }));
      break;
    case TOPIC_SNAPSHOT_STATE_ERROR:
      dispatch(addNotice({
        level: LEVEL_ERROR,
        message: intl.formatMessage(localMessages.hasAnError),
        details: topicInfo.message,
      }));
      break;
    case TOPIC_SNAPSHOT_STATE_COMPLETED:
      // everything is ok
      break;
    default:
      // got some unknown bad state
      dispatch(addNotice({
        level: LEVEL_ERROR,
        message: intl.formatMessage(localMessages.otherError, { state: topicInfo.state }),
      }));
      break;
  }
  // show any warnings based on the snapshot state
  const snapshots = topicInfo.snapshots.list;
  const snapshotJobStatus = topicInfo.snapshots.jobStatus;
  const firstReadySnapshot = snapshots.find(s => snapshotIsUsable(s));
  // if no snapshot specified, pick the first usable snapshot
  if ((snapshotId === null) || (snapshotId === undefined)) {
    // default to the latest ready snapshot if none is specified on url
    if (firstReadySnapshot) {
      const newSnapshotId = firstReadySnapshot.snapshots_id;
      const newLocation = filteredLocation(location, {
        snapshotId: newSnapshotId,
        timespanId: null,
        focusId: null,
        q: null,
      });
      dispatch(replace(newLocation)); // do a replace, not a push here so the non-snapshot url isn't in the history
      dispatch(filterBySnapshot(newSnapshotId));
    } else if (snapshots.length > 0) {
      // first snapshot doesn't show up as a job, so we gotta check for status here and alert if it is importing :-(
      const firstSnapshot = snapshots[0];
      if (!snapshotIsUsable(firstSnapshot)) {
        dispatch(addNotice({
          level: LEVEL_INFO,
          message: intl.formatMessage(localMessages.snapshotImporting),
        }));
      }
    }
  } else if (firstReadySnapshot && firstReadySnapshot.snapshots_id !== parseInt(snapshotId, 10)) {
    // if snaphot is specific in URL, but it is not the latest then show a warning
    dispatch(addNotice({
      level: LEVEL_WARNING,
      htmlMessage: intl.formatHTMLMessage(localMessages.notUsingLatestSnapshot, {
        url: urlWithFilters(location.pathname, {
          snapshotId: firstReadySnapshot.snapshots_id,
        }),
      }),
    }));
  }
  // if a snapshot is in progress then show the user a note about its state
  if (snapshotJobStatus && snapshotJobStatus.length > 0) {
    const latestSnapshotJobStatus = topicInfo.snapshots.jobStatus[0];
    switch (latestSnapshotJobStatus.state) {
      case TOPIC_SNAPSHOT_STATE_QUEUED:
        dispatch(addNotice({
          level: LEVEL_INFO,
          message: intl.formatMessage(localMessages.snapshotQueued),
          details: latestSnapshotJobStatus.message,
        }));
        break;
      case TOPIC_SNAPSHOT_STATE_RUNNING:
        dispatch(addNotice({
          level: LEVEL_INFO,
          message: intl.formatMessage(localMessages.snapshotRunning),
          details: latestSnapshotJobStatus.message,
        }));
        break;
      case TOPIC_SNAPSHOT_STATE_ERROR:
        dispatch(addNotice({
          level: LEVEL_ERROR,
          message: intl.formatMessage(localMessages.snapshotFailed),
          details: latestSnapshotJobStatus.message,
        }));
        break;
      case TOPIC_SNAPSHOT_STATE_COMPLETED:
        const latestSnapshot = snapshots[0];
        if (!snapshotIsUsable(latestSnapshot)) {
          dispatch(addNotice({
            level: LEVEL_INFO,
            message: intl.formatMessage(localMessages.snapshotImporting),
          }));
        }
        break;
      default:
        // don't alert user about anything
    }
  } else if (snapshots.length > 1) {
    // for some reason the second snapshot isn't showing up in the jobs list
    const latestSnapshot = snapshots[0];
    if (!snapshotIsUsable(latestSnapshot)) {
      dispatch(addNotice({
        level: LEVEL_INFO,
        message: intl.formatMessage(localMessages.snapshotImporting),
      }));
    }
  }
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      FilteredTopicContainer
    )
  )
);
