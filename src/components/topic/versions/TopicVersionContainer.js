import PropTypes from 'prop-types';
import React from 'react';
import { push, replace } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import { filteredLocation, urlWithFilters } from '../../util/location';
import LoadingSpinner from '../../common/LoadingSpinner';
import TopicControlBar from '../controlbar/TopicControlBar';
import { addNotice } from '../../../actions/appActions';
import { snapshotIsUsable, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED } from '../../../reducers/topics/selected/snapshots';
import { LEVEL_INFO, LEVEL_WARNING, LEVEL_ERROR } from '../../common/Notice';
import TopicVersionStatusContainer from './TopicVersionStatusContainer';
import TopicVersionErrorStatusContainer from './TopicVersionErrorStatusContainer';
import PageTitle from '../../common/PageTitle';
import { filterBySnapshot } from '../../../actions/topicActions';
import * as fetchConstants from '../../../lib/fetchConstants';
import { VERSION_ERROR, VERSION_ERROR_EXCEEDED, VERSION_CREATING, VERSION_QUEUED, VERSION_RUNNING, VERSION_READY } from '../../../lib/topicFilterUtil';

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
  constructor() {
    super();
    this.setSideBarContent = this.setSideBarContent.bind(this);
  }

  state = {
    sideBarContent: null,
  };

  componentWillMount() {
    const { needsNewSnapshot, addAppNotice } = this.props;
    const { formatMessage } = this.props.intl;
    // warn user if they made changes that require a new snapshot
    if (needsNewSnapshot) {
      addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { topicId, topicInfo, needsNewSnapshot, addAppNotice, filters } = this.props;
    const { formatMessage } = this.props.intl;
    // if they edited the topic, or the topic changed then reload (unless it is just a isFav change)
    let topicInfoHasChanged = false;
    Object.keys(topicInfo).forEach((key) => {
      if ((key !== 'isFavorite') && (topicInfo[key] !== nextProps.topicInfo[key])) {
        topicInfoHasChanged = true;
      }
    });
    if (topicInfoHasChanged || (nextProps.topicId !== topicId) || filters.snapshotId !== nextProps.filters.snapshotId) {
      // warn user if they made changes that require a new snapshot
      if (needsNewSnapshot) {
        addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
      }
    }
    // has snapshot info changed?
  }

  setSideBarContent(sideBarContent) {
    this.setState({ sideBarContent });
  }

  determineVersionStatus(topicInfo) {
    const { snapshotCount } = this.props;
    switch (topicInfo.state) {
      case TOPIC_SNAPSHOT_STATE_ERROR:
      case TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED:
        if (topicInfo.message && topicInfo.message.indexOf('exceeds topic max') > -1) {
          return VERSION_ERROR_EXCEEDED;
        }
        return VERSION_ERROR;
      case TOPIC_SNAPSHOT_STATE_QUEUED:
        return VERSION_QUEUED;
      case TOPIC_SNAPSHOT_STATE_RUNNING:
        if (snapshotCount === 0) {
          return VERSION_CREATING;
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
    const { children, topicId, topicInfo, handleSpiderRequest, handleUpdateMaxStoriesAndSpiderRequest, fetchStatusSnapshot, fetchStatusInfo } = this.props;
    // show a big error if there is one to show

    const childrenWithExtraProp = React.Children.map(children, child => React.cloneElement(child, { setSideBarContent: this.setSideBarContent }));

    let contentToShow = childrenWithExtraProp;

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

    if (this.determineVersionStatus(topicInfo) === VERSION_CREATING) {
      // if the topic is running the initial spider and then show under construction message
      contentToShow = (
        <div>
          {childrenWithExtraProp}
          <TopicVersionStatusContainer />
        </div>
      );
    } else if (this.determineVersionStatus(topicInfo) === VERSION_ERROR_EXCEEDED) { // we know this is not the ideal location nor ideal test but it addresses an immediate need for our admins
      contentToShow = <TopicVersionErrorStatusContainer topicInfo={topicInfo} error={VERSION_ERROR_EXCEEDED} handleUpdateMaxStoriesAndSpiderRequest={handleUpdateMaxStoriesAndSpiderRequest} />;
    } else if (this.determineVersionStatus(topicInfo) === VERSION_ERROR) {
      contentToShow = <TopicVersionErrorStatusContainer topicInfo={topicInfo} error={VERSION_ERROR} handleSpiderRequest={handleSpiderRequest} />;
    } else if (this.determineVersionStatus(topicInfo) === VERSION_QUEUED) {
      contentToShow = <TopicVersionStatusContainer />;
    } else if (fetchStatusInfo !== fetchConstants.FETCH_SUCCEEDED
      && fetchStatusSnapshot !== fetchConstants.FETCH_SUCCEEDED) {
      // how to distinguish between fetch-ongoing and a generating snapshot?
      contentToShow = <LoadingSpinner />;
    }
    return ( // running or complete
      <div className="topic-version-container">
        <PageTitle value={topicInfo.name} />
        {controlbar}
        {contentToShow}
      </div>
    );
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
  handleSpiderRequest: PropTypes.func.isRequired,
  handleUpdateMaxStoriesAndSpiderRequest: PropTypes.func.isRequired,
  goToUrl: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.params.topicId, 10),
  snapshotId: parseInt(ownProps.location.query.snapshotId, 10),
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
  snapshotCount: state.topics.selected.snapshots.list.length,
});

function filtersAreSet(topicId, filters) {
  return (filters && (topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  addAppNotice: (info) => {
    dispatch(addNotice(info));
  },
  goToUrl: (url) => {
    dispatch(push(url));
  },
  /* handleUpdateMaxStoriesAndSpiderRequest: (topicInfo, textInput) => {
    const maxStories = parseInt(textInput.value, 10) > MAX_RECOMMENDED_STORIES ? parseInt(textInput.value, 10) : ADMIN_MAX_RECOMMENDED_STORIES;

    return dispatch(updateTopic(topicInfo.topics_id, { max_stories: maxStories }))
      .then(dispatch(topicStartSpider(topicInfo.topics_id)))
      .then(() => window.location.reload());
  },
  handleSpiderRequest: topicId => dispatch(topicStartSpider(topicId)).then(() => window.location.reload()),
  */
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
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData, ['snapshotId'])(
      TopicVersionContainer
    )
  )
);
