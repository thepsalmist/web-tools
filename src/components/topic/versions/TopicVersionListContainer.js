import PropTypes from 'prop-types';
import React from 'react';
import { push, replace } from 'react-router-redux';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import messages from '../../../resources/messages';
import BackLinkingControlBar from '../BackLinkingControlBar';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { filteredLocation, urlWithFilters, filteredLinkTo } from '../../util/location';
import { addNotice } from '../../../actions/appActions';
import { filterBySnapshot } from '../../../actions/topicActions';
import { LEVEL_INFO, LEVEL_WARNING, LEVEL_ERROR } from '../../common/Notice';
import { snapshotIsUsable, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR } from '../../../reducers/topics/selected/snapshots';

const localMessages = {
  versions: { id: 'topic.versions', defaultMessage: 'Version List' },
  versionNumber: { id: 'topic.versionNumber', defaultMessage: 'Version Number {number}' },
  versionDate: { id: 'topic.versionDate', defaultMessage: 'Date: {date}' },
  versionStatus: { id: 'topic.versionStatus', defaultMessage: 'Status: {status}' },
  createdBy: { id: 'topic.createdBy', defaultMessage: 'Created by: ' },
  createButton: { id: 'topic.create', defaultMessage: 'Create A New Version ' },
  viewButton: { id: 'topic.viewBy', defaultMessage: 'Find Out More ' },
  hasAnError: { id: 'topic.hasError', defaultMessage: 'Sorry, this topic has an error!' },
  otherError: { id: 'topic.otherError', defaultMessage: 'Sorry, this topic has an error!' },
  spiderQueued: { id: 'topic.spiderQueued', defaultMessage: 'This topic is in the queue for spidering stories.  Please reload after a bit to see if it has started spidering.' },
  snapshotQueued: { id: 'snapshotGenerating.warning.queued', defaultMessage: 'We will start creating the new snapshot soon. Please reload this page in a few hours to check if your data is ready.' },
  snapshotRunning: { id: 'snapshotGenerating.warning.running', defaultMessage: 'We are creating a new snapshot right now. Please reload this page in a few hours to check if your data is ready.' },
  snapshotImporting: { id: 'snapshotGenerating.warning.importing', defaultMessage: 'We are importing the new snapshot now. Please reload this page in a few hours to check if your data is ready.' },
  snapshotFailed: { id: 'snapshotFailed.warning', defaultMessage: 'We tried to generate a new snapshot, but it failed.' },
  topicRunning: { id: 'topic.topicRunning', defaultMessage: 'We are scraping the web for all the stories in include in your topic.' },
  queueAge: { id: 'topic.spiderQueuedAge', defaultMessage: 'In the {queueName} queue since {lastUpdated}' },
  notUsingLatestSnapshot: { id: 'topic.notUsingLatestSnapshot', defaultMessage: 'You are not using the latest snapshot!  If you are not doing this on purpose, <a href="{url}">switch to the latest snapshot</a> to get the best data.' },
};

const TopicVersionListContainer = (props) => {
  const { topicId, versions, filters, handleCreateSnapshot } = props;
  const { formatMessage } = props.intl;
  let versionListContent;
  if (versions.length > 0) {
    versionListContent = versions.map((u, idx) => (
      <div>
        <h2><FormattedMessage {...localMessages.versionNumber} values={{ number: idx }} /></h2>
        <FormattedMessage {...localMessages.versionDate} values={{ date: u.snapshot_date }} />
        <br />
        <FormattedMessage {...localMessages.versionStatus} values={{ status: u.message }} />
        <AppButton
          style={{ marginTop: 30 }}
          type="submit"
          label={formatMessage(localMessages.viewButton)}
        />
      </div>
    )).sort((f1, f2) => {
      if (f1.snapshot_date < f2.snapshot_date) {
        return 1;
      }
      return -1;
    });
  } else {
    versionListContent = <FormattedMessage {...localMessages.versionNumber} values={{ number: 1 }} />;
  }
  const cannotCreate = false; // TODO: if any snapshot is building

  return (
    <div className="topic-version-list">
      <BackLinkingControlBar message={messages.backToTopic} linkTo={`/topics/${topicId}/summary`} />
      <Grid>
        <Row>
          <Col lg={12}>
            <p><FormattedMessage {...localMessages.versions} /></p>
          </Col>
        </Row>
        <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
          {versionListContent}
          <AppButton
            style={{ marginTop: 30 }}
            type="submit"
            disabled={cannotCreate}
            label={formatMessage(localMessages.createButton)}
            onClick={() => handleCreateSnapshot(topicId, filters)}
            primary
          />
        </Permissioned>
      </Grid>

    </div>
  );
};

TopicVersionListContainer.propTypes = {
  // from parent
  versions: PropTypes.array.isRequired,
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  handleCreateSnapshot: PropTypes.func.isRequired,
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

const mapDispatchToProps = dispatch => ({
  handleCreateSnapshot: (topicId, filters) => {
    // TODO: should we just dispatch to the next screen, or also create the snapshot?
    // dispatch(createSnapshot(info));
    const url = `/topics/${topicId}/new-version`;
    dispatch(push(filteredLinkTo(url, filters)));
  },
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
  // TODO: we could dispatch a createSnapshot here if there are no usable snapshots
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
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData, ['versions'])(
      TopicVersionListContainer
    )
  )
);
