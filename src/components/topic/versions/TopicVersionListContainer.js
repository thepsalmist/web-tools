import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import LinkWithFilters from '../LinkWithFilters';
import AppButton from '../../common/AppButton';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import messages from '../../../resources/messages';
import BackLinkingControlBar from '../BackLinkingControlBar';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { fetchSnapshotStoryCounts } from '../../../actions/topicActions';
import TopicVersionListItem from './TopicVersionListItem';
import NeedsNewVersionWarning from './NeedsNewVersionWarning';

const localMessages = {
  title: { id: 'topic.versionList.title', defaultMessage: 'Your Topic Has {count} Versions' },
  versionNumber: { id: 'topic.versionNumber', defaultMessage: 'Version {number}' },
  versionState: { id: 'topic.versionState', defaultMessage: '{state}' },
  versionDate: { id: 'topic.versionDate', defaultMessage: '{date}' },
  versionStatus: { id: 'topic.versionStatus', defaultMessage: 'Job status: {status}' },
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

const TopicVersionListContainer = ({ topicId, topicInfo, storyCounts, versions, selectedSnapshot, intl }) => {
  const { formatMessage } = intl;
  let versionListContent;
  if (versions.length > 0) {
    versionListContent = versions.sort((v1, v2) => {
      if (v1.snapshot_date < v2.snapshot_date) {
        return 1;
      }
      return -1;
    }).map((snapshot, idx) => (
      <TopicVersionListItem
        selected={selectedSnapshot.snapshots_id === snapshot.snapshots_id}
        key={idx}
        topicId={topicId}
        number={versions.length - idx}
        version={snapshot}
        storyCounts={storyCounts[snapshot.snapshots_id]}
      />
    ));
  } else {
    // handle older topics that error'd out without any snapshots being created
    versionListContent = (
      <TopicVersionListItem
        seleceted
        number={1}
        topicId={topicId}
        version={{
          state: topicInfo.state,
          snapshots_id: -1,
          snapshot_date: '?',
          status: '?',
        }}
        storyCounts={{}}
      />
    );
  }
  const cannotCreate = false; // TODO: if any snapshot is building
  return (
    <div className="topic-version-list">
      <BackLinkingControlBar message={messages.backToTopic} linkTo={`/topics/${topicId}/summary`} />
      <NeedsNewVersionWarning />
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.title} values={{ count: Math.max(1, versions ? versions.length : 0) }} /></h1>
          </Col>
        </Row>
        <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
          {versionListContent}
          <LinkWithFilters to={`/topics/${topicId}/new-version`}>
            <AppButton
              style={{ marginTop: 30 }}
              type="submit"
              disabled={cannotCreate}
              label={formatMessage(localMessages.createButton)}
              primary
            />
          </LinkWithFilters>
        </Permissioned>
      </Grid>

    </div>
  );
};

TopicVersionListContainer.propTypes = {
  // from state
  versions: PropTypes.array.isRequired,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  storyCounts: PropTypes.object,
  selectedSnapshot: PropTypes.object,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  versions: state.topics.selected.snapshots.list,
  storyCounts: state.topics.selected.snapshotStoryCounts,
  fetchStatus: state.topics.selected.snapshotStoryCounts.fetchStatus,
  selectedSnapshot: state.topics.selected.snapshots.selected,
});

const fetchAsyncData = (dispatch, { topicId }) => {
  dispatch(fetchSnapshotStoryCounts(topicId));
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      TopicVersionListContainer
    )
  )
);
