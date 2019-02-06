import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { addNotice } from '../../../actions/appActions';
import { TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING,
  TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED } from '../../../reducers/topics/selected/snapshots';
import { LEVEL_WARNING } from '../../common/Notice';
import TopicVersionStatusContainer from './TopicVersionStatusContainer';
import TopicVersionErrorStatusContainer from './TopicVersionErrorStatusContainer';
import PageTitle from '../../common/PageTitle';
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

class TopicContainer extends React.Component {
  componentWillMount() {
    const { needsNewSnapshot, addAppNotice } = this.props;
    const { formatMessage } = this.props.intl;
    // warn user if they made changes that require a new snapshot
    if (needsNewSnapshot) {
      addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { topicId, topicInfo, needsNewSnapshot, addAppNotice } = this.props;
    const { formatMessage } = this.props.intl;
    // if they edited the topic, or the topic changed then reload (unless it is just a isFav change)
    let topicInfoHasChanged = false;
    Object.keys(topicInfo).forEach((key) => {
      if ((key !== 'isFavorite') && (topicInfo[key] !== nextProps.topicInfo[key])) {
        topicInfoHasChanged = true;
      }
    });
    if (topicInfoHasChanged || (nextProps.topicId !== topicId)) {
      // warn user if they made changes that require a new snapshot
      if (needsNewSnapshot) {
        addAppNotice({ level: LEVEL_WARNING, message: formatMessage(localMessages.needsSnapshotWarning) });
      }
    }
  }

  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
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
    const { children, topicInfo, handleSpiderRequest, handleUpdateMaxStoriesAndSpiderRequest } = this.props;
    // show a big error if there is one to show
    let contentToShow = children;
    if (this.determineVersionStatus(topicInfo) === VERSION_CREATING) {
      // if the topic is running the initial spider and then show under construction message
      contentToShow = (
        <div>
          {children}
          <TopicVersionStatusContainer />
        </div>
      );
    } else if (this.determineVersionStatus(topicInfo) === VERSION_ERROR_EXCEEDED) { // we know this is not the ideal location nor ideal test but it addresses an immediate need for our admins
      contentToShow = <TopicVersionErrorStatusContainer topicInfo={topicInfo} error={VERSION_ERROR_EXCEEDED} handleUpdateMaxStoriesAndSpiderRequest={handleUpdateMaxStoriesAndSpiderRequest} />;
    } else if (this.determineVersionStatus(topicInfo) === VERSION_ERROR) {
      contentToShow = <TopicVersionErrorStatusContainer topicInfo={topicInfo} error={VERSION_ERROR} handleSpiderRequest={handleSpiderRequest} />;
    } else if (this.determineVersionStatus(topicInfo) === VERSION_QUEUED) {
      contentToShow = <TopicVersionStatusContainer />;
    }
    return ( // running or complete
      <div className="topic-version-container">
        <PageTitle value={topicInfo.name} />
        {contentToShow}
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
  // from dispatch
  addAppNotice: PropTypes.func.isRequired,
  handleSpiderRequest: PropTypes.func.isRequired,
  handleUpdateMaxStoriesAndSpiderRequest: PropTypes.func.isRequired,
  // from state
  filters: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  topicInfo: PropTypes.object,
  needsNewSnapshot: PropTypes.bool.isRequired,
  snapshotCount: PropTypes.number.isRequired,
  goToUrl: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.params.topicId, 10),
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
  snapshotCount: state.topics.selected.snapshots.list.length,
});

const mapDispatchToProps = dispatch => ({
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
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    TopicContainer
  )
);
