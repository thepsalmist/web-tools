import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import LoadingSpinner from '../../common/LoadingSpinner';
import { TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED } from '../../../reducers/topics/selected/snapshots';
import TopicVersionStatusContainer from './TopicVersionStatusContainer';
import TopicVersionErrorStatusContainer from './TopicVersionErrorStatusContainer';
import TopicVersionRunningStatusContainer from './TopicVersionRunningStatusContainer';
import TopicVersionTooBigStatusContainer from './TopicVersionTooBigStatusContainer';
import * as fetchConstants from '../../../lib/fetchConstants';
import { filteredLinkTo } from '../../util/location';
import { VERSION_ERROR, VERSION_ERROR_EXCEEDED, VERSION_CREATING, VERSION_BUILDING, VERSION_QUEUED, VERSION_RUNNING, VERSION_READY } from '../../../lib/topicFilterUtil';
import { getCurrentVersionFromSnapshot } from '../../../lib/topicVersionUtil';

/**
 * This decides which topic version homepage to show, based on the version and topic state
 */
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
    const { children, topicInfo, goToCreateNewVersion, fetchStatusSnapshot, fetchStatusInfo, setSideBarContent, user, currentVersionId, filters, selectedSnapshot } = this.props;
    // show a big error if there is one to show
    const currentVersionNum = getCurrentVersionFromSnapshot(topicInfo, currentVersionId);
    let contentToShow = children; // has a filters renderer in it - show if a completed topic
    const childrenWithExtraProp = React.Children.map(children, child => React.cloneElement(child, { setSideBarContent }));
    contentToShow = childrenWithExtraProp;
    if (this.determineVersionStatus(topicInfo) === VERSION_RUNNING) {
      contentToShow = (
        <TopicVersionRunningStatusContainer
          topic={topicInfo}
          snapshot={selectedSnapshot || { note: currentVersionNum }}
          job={topicInfo.spiderJobs[0]}
        />
      );
    } else if (this.determineVersionStatus(topicInfo) === VERSION_CREATING
        || this.determineVersionStatus(topicInfo) === VERSION_QUEUED) {
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
      contentToShow = (
        <TopicVersionTooBigStatusContainer
          topic={topicInfo}
          snapshot={selectedSnapshot || { note: currentVersionNum }}
          job={topicInfo.spiderJobs[0]}
          goToCreateNewVersion={() => goToCreateNewVersion(topicInfo, filters)}
          error={VERSION_ERROR}
        />
      );
    } else if (this.determineVersionStatus(topicInfo) === VERSION_ERROR) {
      contentToShow = (
        <TopicVersionErrorStatusContainer
          topic={topicInfo}
          snapshot={selectedSnapshot || { note: currentVersionNum }}
          job={topicInfo.spiderJobs[0]}
          goToCreateNewVersion={() => goToCreateNewVersion(topicInfo, filters)}
          error={VERSION_ERROR}
        />
      );
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
  // from state
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchStatusInfo: PropTypes.string,
  fetchStatusSnapshot: PropTypes.string,
  topicInfo: PropTypes.object,
  selectedSnapshot: PropTypes.object,
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
  selectedSnapshot: state.topics.selected.snapshots.selected,
  currentVersionId: parseInt(ownProps.location.query.snapshotId, 10),
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
  snapshotCount: state.topics.selected.snapshots.list.length,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  goToCreateNewVersion: (topicInfo, filters) => {
    const url = `/topics/${topicInfo.topics_id}/update`;
    dispatch(push(filteredLinkTo(url, filters)));
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    TopicVersionContainer
  )
);
