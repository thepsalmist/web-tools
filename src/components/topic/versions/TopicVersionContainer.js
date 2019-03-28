import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push, replace } from 'react-router-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import LoadingSpinner from '../../common/LoadingSpinner';
import { addNotice } from '../../../actions/appActions';
import { snapshotIsUsable, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED } from '../../../reducers/topics/selected/snapshots';
import { LEVEL_INFO, LEVEL_WARNING, LEVEL_ERROR } from '../../common/Notice';
import TopicVersionStatusContainer from './TopicVersionStatusContainer';
import TopicVersionErrorStatusContainer from './TopicVersionErrorStatusContainer';
// import PageTitle from '../../common/PageTitle';
import { filterBySnapshot } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants';
import { emptyString } from '../../../lib/formValidators';
import { filteredLocation, urlWithFilters, filteredLinkTo } from '../../util/location';
import { VERSION_ERROR, VERSION_ERROR_EXCEEDED, VERSION_CREATING, VERSION_BUILDING, VERSION_QUEUED, VERSION_RUNNING, VERSION_READY } from '../../../lib/topicFilterUtil';
import { getTopicVersionInfo, getCurrentVersionFromSnapshot } from '../../../lib/topicVersionUtil';

const localMessages = {
  needsSnapshotWarning: { id: 'needSnapshot.warning', defaultMessage: 'You\'ve made changes to your Topic that require a new snapshot to be generated!' },
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

class TopicVersionContainer extends React.Component {
  determineVersionStatus(topicInfo) {
    const { snapshotCount } = this.props;
    switch (topicInfo.state) {
      case TOPIC_SNAPSHOT_STATE_ERROR:
        if (topicInfo.message && topicInfo.message.indexOf('exceeds topic max') > -1) {
          return VERSION_ERROR_EXCEEDED;
        }
        return VERSION_ERROR;
      case TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED:
        return VERSION_CREATING;
      case TOPIC_SNAPSHOT_STATE_QUEUED:
        return VERSION_QUEUED;
      case TOPIC_SNAPSHOT_STATE_RUNNING:
        if (snapshotCount === 0) {
          return VERSION_RUNNING;
        }
        // also evaluate another kind of error like VERSION_RUNNING_ERROR
        return VERSION_RUNNING;
      case TOPIC_SNAPSHOT_STATE_COMPLETED:
        return VERSION_READY;
      default:
        return 0;
      // case ? return VERSION_CANCELLED:
    }
  }

  render() {
    const { children, topicInfo, goToCreateNewVersion, fetchStatusSnapshot, fetchStatusInfo, setSideBarContent, user, currentVersionId, filters } = this.props;
    // show a big error if there is one to show
    const currentVersionNum = getCurrentVersionFromSnapshot(topicInfo, currentVersionId);
    let contentToShow = children; // has a filters renderer in it - show if a completed topic
    const childrenWithExtraProp = React.Children.map(children, child => React.cloneElement(child, { setSideBarContent }));
    contentToShow = childrenWithExtraProp;
    if (this.determineVersionStatus(topicInfo) === VERSION_CREATING
        || this.determineVersionStatus(topicInfo) === VERSION_QUEUED
        || this.determineVersionStatus(topicInfo) === VERSION_RUNNING) {
      // if the topic is running the initial spider and then show under construction message
      contentToShow = (
        <div>
          <TopicVersionStatusContainer
            topicInfo={topicInfo}
            displayState={VERSION_BUILDING}
            user={user}
            currentVersion={currentVersionNum}
            filters={filters}
          />
        </div>
      );
    } else if (this.determineVersionStatus(topicInfo) === VERSION_ERROR_EXCEEDED) { // we know this is not the ideal location nor ideal test but it addresses an immediate need for our admins
      contentToShow = <TopicVersionErrorStatusContainer topicInfo={topicInfo} error={VERSION_ERROR_EXCEEDED} goToCreateNewVersion={() => goToCreateNewVersion(topicInfo, filters)} currentVersion={currentVersionNum} />;
    } else if (this.determineVersionStatus(topicInfo) === VERSION_ERROR) {
      contentToShow = <TopicVersionErrorStatusContainer topicInfo={topicInfo} error={VERSION_ERROR} goToCreateNewVersion={() => goToCreateNewVersion(topicInfo, filters)} currentVersion={currentVersionNum} />;
    } else if (fetchStatusInfo !== fetchConstants.FETCH_SUCCEEDED
      && fetchStatusSnapshot !== fetchConstants.FETCH_SUCCEEDED) {
      // complete
      contentToShow = <LoadingSpinner />;
    }
    return contentToShow;
  }
}

TopicVersionContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  // from dispatch
  addAppNotice: PropTypes.func.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchStatusInfo: PropTypes.string,
  fetchStatusSnapshot: PropTypes.string,
  topicInfo: PropTypes.object,
  needsNewSnapshot: PropTypes.bool.isRequired,
  snapshotCount: PropTypes.number.isRequired,
  goToCreateNewVersion: PropTypes.func,
  setSideBarContent: PropTypes.func,
  user: PropTypes.object,
  currentVersionId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.params.topicId, 10),

  currentVersionId: parseInt(ownProps.location.query.snapshotId, 10),
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
  snapshotCount: state.topics.selected.snapshots.list.length,
  user: state.user,
});

function filtersAreSet(topicId, filters) {
  return (filters && (topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  addAppNotice: (info) => {
    dispatch(addNotice(info));
  },
  goToCreateNewVersion: (topicInfo, filters) => {
    const url = `/topics/${topicInfo.topics_id}/update`;
    dispatch(push(filteredLinkTo(url, filters)));
  },
  showFilters: filtersAreSet(ownProps.topicId, ownProps.filters),
});

const fetchAsyncData = (dispatch, { topicInfo, location, intl }) => {
// get filters
  const { query } = location;
  const { snapshotId } = query;
  if (snapshotId) {
    dispatch(filterBySnapshot(query.snapshotId));
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
  // show any warnings based on the snapshot/version state
  const topicVersionInfo = getTopicVersionInfo(topicInfo);

  // if no snapshot specified, pick the latest usable snapshot
  if (emptyString(snapshotId)) {
    // default to the latest snapshot if none is specified on url
    // or the first snapshot if none is usable
    // TODO: WarningNotice if user is not looking at most recent and usable
    if (topicVersionInfo.versionList.length > 0) {
      const firstSnapshot = topicVersionInfo.versionList[0];
      const latestSnapshotId = topicVersionInfo.lastReadySnapshot ? topicVersionInfo.lastReadySnapshot.snapshots_id : firstSnapshot.snapshots_id;
      const newLocation = filteredLocation(location, {
        snapshotId: latestSnapshotId,
        timespanId: null,
        focusId: null,
        q: null,
      });
      dispatch(replace(newLocation)); // do a replace, not a push here so the non-snapshot url isn't in the history
      dispatch(filterBySnapshot(latestSnapshotId));
    }

    // if nothing is ready/usable, put up a notice
    if (!topicVersionInfo.lastReadySnapshot) {
      dispatch(addNotice({
        level: LEVEL_INFO,
        message: intl.formatMessage(localMessages.snapshotImporting),
      }));
    }
  } else if ((topicVersionInfo.lastReadySnapshot
      && topicVersionInfo.lastReadySnapshot.snapshots_id !== parseInt(snapshotId, 10))
      || topicVersionInfo.versionList.length !== getCurrentVersionFromSnapshot(topicInfo, snapshotId)) {
    // if snaphot is specific in URL, but it is not the latest then show a warning
    dispatch(addNotice({
      level: LEVEL_WARNING,
      htmlMessage: intl.formatHTMLMessage(localMessages.notUsingLatestSnapshot, {
        url: urlWithFilters(location.pathname, {
          snapshotId,
        }),
      }),
    }));
  }
  // if a snapshot is in progress then show the user a note about its state
  if (topicVersionInfo.snapshotJobStatus && topicVersionInfo.snapshotJobStatus.length > 0) {
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
        const latestSnapshot = topicVersionInfo.versionList[0];
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
  } else if (topicVersionInfo.versionList.length > 1) {
    // for some reason the second snapshot isn't showing up in the jobs list
    const latestSnapshot = topicVersionInfo.versionList[0];
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
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData, ['snapshotId'])(
      TopicVersionContainer
    )
  )
);
