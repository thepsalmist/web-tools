import PropTypes from 'prop-types';
import React from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import messages from '../../../resources/messages';
import { filteredLocation, urlWithFilters } from '../../util/location';
import { addNotice } from '../../../actions/appActions';
import { filterBySnapshot } from '../../../actions/topicActions';
import { LEVEL_INFO, LEVEL_WARNING, LEVEL_ERROR } from '../../common/Notice';
import { snapshotIsUsable, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR } from '../../../reducers/topics/selected/snapshots';

const localMessages = {
  createdBy: { id: 'topic.createdBy', defaultMessage: 'Created by: ' },
};

const TopicVersionListContainer = (props) => {
  const { versions } = props;
  let versionListContent;
  if (versions.length > 0) {
    versionListContent = versions.map(u => u.name).join(', ');
  } else {
    versionListContent = <FormattedMessage {...messages.unknown} />;
  }
  return (
    <div className="topic-version-list">
      <p><FormattedMessage {...localMessages.createdBy} /><i>{versionListContent}</i></p>
    </div>
  );
};

TopicVersionListContainer.propTypes = {
  // from parent
  versions: PropTypes.array.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  snapshotId: state.topics.selected.filters.snapshotId,
  versions: state.topics.selected.snapshots.list,
  selectedTimespan: state.topics.selected.timespans.selected,
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
    withAsyncData(fetchAsyncData, ['versions'])(
      TopicVersionListContainer
    )
  )
);
