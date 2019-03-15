import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import messages from '../../../resources/messages';
import BackLinkingControlBar from '../BackLinkingControlBar';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { urlWithFilters, filteredLinkTo } from '../../util/location';
import { fetchSnapshotStoryCounts } from '../../../actions/topicActions';
import TopicVersionListItem from './TopicVersionListItem';

const localMessages = {
  title: { id: 'topic.versionList.title', defaultMessage: 'Your Topic has {count} Versions' },
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

const TopicVersionListContainer = (props) => {
  const { topicId, topicInfo, storyCounts, versions, filters, handleCreateSnapshot } = props;
  const { formatMessage } = props.intl;
  let versionListContent;
  if (versions.length > 0) {
    versionListContent = versions.sort((v1, v2) => {
      if (v1.snapshot_date < v2.snapshot_date) {
        return 1;
      }
      return -1;
    }).map((v, idx) => (
      <TopicVersionListItem
        key={idx}
        url={urlWithFilters(`/topics/${topicId}/summary`, { snapshotId: v.snapshots_id })}
        number={versions.length - idx}
        version={v}
        storyCounts={storyCounts[v.snapshots_id]}
      />
    ));
  } else {
    // handle older topics that error'd out without any snapshots being created
    versionListContent = (
      <TopicVersionListItem
        number={1}
        url={urlWithFilters(`/topics/${topicId}/summary`, { })}
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
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedMessage {...localMessages.title} values={{ count: versions.length }} /></h1>
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
  topicInfo: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  storyCounts: PropTypes.object,
  // from compositional chain
  intl: PropTypes.object.isRequired,
  handleCreateSnapshot: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
  versions: state.topics.selected.snapshots.list,
  storyCounts: state.topics.selected.snapshotStoryCounts,
  fetchStatus: state.topics.selected.snapshotStoryCounts.fetchStatus,
});

const mapDispatchToProps = dispatch => ({
  handleCreateSnapshot: (topicId, filters) => {
    // TODO: should we just dispatch to the next screen, or also create the snapshot?
    // dispatch(createSnapshot(info));
    const url = `/topics/${topicId}/new-version`;
    dispatch(push(filteredLinkTo(url, filters)));
  },
});

const fetchAsyncData = (dispatch, { topicId }) => {
  dispatch(fetchSnapshotStoryCounts(topicId));
};

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncData(fetchAsyncData)(
      TopicVersionListContainer
    )
  )
);
