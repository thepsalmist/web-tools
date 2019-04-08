import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LoadingSpinner from '../../common/LoadingSpinner';
import { TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED } from '../../../reducers/topics/selected/snapshots';
import TopicVersionQueuedStatusContainer from './homepages/TopicVersionQueuedStatusContainer';
import TopicVersionErrorStatusContainer from './homepages/TopicVersionErrorStatusContainer';
import TopicVersionRunningStatusContainer from './homepages/TopicVersionRunningStatusContainer';
import TopicVersionTooBigStatusContainer from './homepages/TopicVersionTooBigStatusContainer';
import TopicVersionCreatedStatusContainer from './homepages/TopicVersionCreatedStatusContainer';
import * as fetchConstants from '../../../lib/fetchConstants';
import { filteredLinkTo } from '../../util/location';
import { getCurrentVersionFromSnapshot } from '../../../lib/topicVersionUtil';
import { topicSnapshotSpider } from '../../../actions/topicActions';
import { LEVEL_ERROR } from '../../common/Notice';
import { addNotice, updateFeedback } from '../../../actions/appActions';
import { topicMessageSaysTooBig } from '../../../reducers/topics/adminList';

const localMessages = {
  startedGenerating: { id: 'topic.created.startedGenerating', defaultMessage: 'We started generating this version' },
  generationFailed: { id: 'topic.created.generationFailed', defaultMessage: 'Sorry, but we weren\'t able to start generating this version.' },
  runningSubtitle: { id: 'version.running.title', defaultMessage: 'Still Generating' },
  almostDoneSubtitle: { id: 'version.cancel', defaultMessage: 'Cancel This Version' },
};

/**
 * This decides which topic version homepage to show, based on the version and topic state
 */
const TopicVersionContainer = (props) => {
  const { children, topic, goToCreateNewVersion, fetchStatusSnapshot, fetchStatusInfo,
    setSideBarContent, snapshotId, filters, selectedSnapshot, handleSnapshotGenerate } = props;
  const currentVersionNum = getCurrentVersionFromSnapshot(topic, snapshotId);
  // carefully figure out what the latest state for this version is
  let snapshotToUse;
  if (selectedSnapshot) {
    snapshotToUse = selectedSnapshot;
    if (snapshotToUse.job_states.length > 0) {
      snapshotToUse = {
        ...selectedSnapshot,
        state: snapshotToUse.job_states[0].state, // override the state because the job state is the most up-to-date
      };
    }
  } else {
    // legacy - there might be jobs but isn't a snapshot yet, so make one that looks right-ish
    snapshotToUse = {
      note: currentVersionNum,
      job_states: topic.job_states,
      state: topic.job_states.length > 0 ? topic.job_states[0].state : topic.state,
    };
  }
  let contentToShow;
  // handle case where there isn't a snapshot object yet (legacy)
  if (snapshotToUse.state === TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED) {
    contentToShow = (
      <TopicVersionCreatedStatusContainer
        topic={topic}
        snapshot={snapshotToUse}
        onSnapshotGenerate={handleSnapshotGenerate}
        goToCreateNewVersion={() => goToCreateNewVersion(topic, filters)}
      />
    );
  } else if (snapshotToUse.state === TOPIC_SNAPSHOT_STATE_QUEUED) {
    contentToShow = (
      <TopicVersionQueuedStatusContainer
        topic={topic}
        snapshot={snapshotToUse}
        goToCreateNewVersion={() => goToCreateNewVersion(topic, filters)}
      />
    );
  } else if ((snapshotToUse.state === TOPIC_SNAPSHOT_STATE_RUNNING)
    || ((snapshotToUse.state === TOPIC_SNAPSHOT_STATE_COMPLETED) && !snapshotToUse.isUsable)) {
    contentToShow = (
      <TopicVersionRunningStatusContainer
        topic={topic}
        snapshot={snapshotToUse}
        title={(snapshotToUse.state === TOPIC_SNAPSHOT_STATE_RUNNING) ? localMessages.runningSubtitle : localMessages.almostDoneSubtitle}
      />
    );
  } else if ((snapshotToUse.state === TOPIC_SNAPSHOT_STATE_ERROR) && topicMessageSaysTooBig(topic.message)) {
    contentToShow = (
      <TopicVersionTooBigStatusContainer
        topic={topic}
        snapshot={snapshotToUse}
        goToCreateNewVersion={() => goToCreateNewVersion(topic, filters)}
      />
    );
  } else if (snapshotToUse.state === TOPIC_SNAPSHOT_STATE_ERROR) {
    contentToShow = (
      <TopicVersionErrorStatusContainer
        topic={topic}
        snapshot={snapshotToUse}
        goToCreateNewVersion={() => goToCreateNewVersion(topic, filters)}
      />
    );
  } else if ((snapshotToUse.state === TOPIC_SNAPSHOT_STATE_COMPLETED)
    && (fetchStatusInfo !== fetchConstants.FETCH_SUCCEEDED
    && fetchStatusSnapshot !== fetchConstants.FETCH_SUCCEEDED)) {
    // complete
    contentToShow = <LoadingSpinner />;
  } else {
    // has a filters renderer in it - show if a completed topic
    const childrenWithExtraProp = React.Children.map(children, child => React.cloneElement(child, { setSideBarContent }));
    contentToShow = childrenWithExtraProp;
  }
  return contentToShow;
};

TopicVersionContainer.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  // from dispatch
  handleSnapshotGenerate: PropTypes.func.isRequired,
  goToCreateNewVersion: PropTypes.func,
  // from state
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchStatusInfo: PropTypes.string,
  fetchStatusSnapshot: PropTypes.string,
  topic: PropTypes.object,
  selectedSnapshot: PropTypes.object,
  needsNewSnapshot: PropTypes.bool.isRequired,
  snapshotCount: PropTypes.number.isRequired,
  setSideBarContent: PropTypes.func,
  snapshotId: PropTypes.number,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  topic: state.topics.selected.info,
  topicId: state.topics.selected.id,
  selectedSnapshot: state.topics.selected.snapshots.selected,
  snapshotId: state.topics.selected.filters.snapshotId,
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
  snapshotCount: state.topics.selected.snapshots.list.length,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  goToCreateNewVersion: (topic, filters) => {
    const url = `/topics/${topic.topics_id}/update`;
    dispatch(push(filteredLinkTo(url, filters)));
  },
  handleSnapshotGenerate: (topicId, snapshotId) => {
    dispatch(topicSnapshotSpider(topicId, { snapshotId }))
      .then((results) => {
        if ((results.statusCode && results.statusCode !== 200) || results.error) {
          dispatch(addNotice({ message: localMessages.generationFailed, details: results.message || results.error, level: LEVEL_ERROR }));
        } else {
          dispatch(updateFeedback({ open: true, message: ownProps.intl.formatMessage(localMessages.startedGenerating) }));
          window.location.reload(); // to get new version status (ie. running hopefully)
        }
      });
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    TopicVersionContainer
  )
);
