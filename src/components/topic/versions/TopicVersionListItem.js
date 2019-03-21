import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedHTMLMessage, FormattedDate } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import { TOPIC_SNAPSHOT_STATE_QUEUED, TOPIC_SNAPSHOT_STATE_RUNNING, TOPIC_SNAPSHOT_STATE_COMPLETED, TOPIC_SNAPSHOT_STATE_ERROR, TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED } from '../../../reducers/topics/selected/snapshots';
import LinkWithFilters from '../LinkWithFilters';

const localMessages = {
  versionNumber: { id: 'topic.versionNumber', defaultMessage: 'Version {number}' },
  versionStatus: { id: 'topic.versionStatus', defaultMessage: 'Job status: {status}' },
  defaultAction: { id: 'topic.viewBy', defaultMessage: 'Find Out More' },
  queued: { id: 'topic.state.queued', defaultMessage: '<i>Waiting In Line</i>' },
  queuedDetails: { id: 'topic.state.queuedDetails', defaultMessage: 'Waiting for a turn to generate ({age}).' },
  running: { id: 'topic.state.running', defaultMessage: '<i>Generating</i>' },
  runningDetails: { id: 'topic.state.runningDetails', defaultMessage: 'We are still collecting stories for this version.' },
  runningAction: { id: 'topic.state.runningAction', defaultMessage: 'See Details' },
  completed: { id: 'topic.state.running', defaultMessage: 'Ready to use' },
  completedAction: { id: 'topic.state.useVersion', defaultMessage: 'Use Version {number}' },
  completedDetails: { id: 'topic.state.completedDetails', defaultMessage: 'Includes {total} stories ({discoveredPct} discovered),' },
  error: { id: 'topic.state.running', defaultMessage: 'Failed' },
  createdNotQueued: { id: 'topic.state.createdNotQueued', defaultMessage: 'Created' },
  createdNotQueuedDetails: { id: 'topic.state.createdNotQueuedDetails', defaultMessage: 'This version hasn\'t been generated yet.' },
  createdNotQueuedAction: { id: 'topic.state.finishGenerating', defaultMessage: 'Finish up and generate' },
};

const versionSelectText = (state, number, formatMessage) => {
  switch (state) {
    case TOPIC_SNAPSHOT_STATE_COMPLETED:
      return formatMessage(localMessages.completedAction, { number });
    case TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED:
      return formatMessage(localMessages.createdNotQueuedAction);
    case TOPIC_SNAPSHOT_STATE_RUNNING:
      return formatMessage(localMessages.runningAction);
    default:
      return formatMessage(localMessages.defaultAction);
  }
};

const messageForVersionState = (state) => {
  switch (state) {
    case TOPIC_SNAPSHOT_STATE_QUEUED:
      return localMessages.queued;
    case TOPIC_SNAPSHOT_STATE_RUNNING:
      return localMessages.running;
    case TOPIC_SNAPSHOT_STATE_COMPLETED:
      return localMessages.completed;
    case TOPIC_SNAPSHOT_STATE_ERROR:
      return localMessages.error;
    case TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED:
      return localMessages.createdNotQueued;
    default:
      return state;
  }
};

const detailsForVersionState = (version, storyCounts, formatMessage, formatNumber) => {
  switch (version.state) {
    case TOPIC_SNAPSHOT_STATE_QUEUED:
      return formatMessage(localMessages.queuedDetails, {
        age: version.snapshotDate.fromNow(), // this is a moment object so we can call this relative date helper
      });
    case TOPIC_SNAPSHOT_STATE_COMPLETED:
      return formatMessage(localMessages.completedDetails, {
        total: formatNumber(storyCounts.total),
        discoveredPct: storyCounts.total === 0 ? '0%' : formatNumber(storyCounts.spidered / storyCounts.total, { style: 'percent', maximumFractionDigits: 0 }),
      });
      // TODO
    case TOPIC_SNAPSHOT_STATE_RUNNING:
      return formatMessage(localMessages.runningDetails);
    case TOPIC_SNAPSHOT_STATE_ERROR:
      return version.message;
    case TOPIC_SNAPSHOT_STATE_CREATED_NOT_QUEUED:
      return formatMessage(localMessages.createdNotQueuedDetails);
    default:
      return version.state;
  }
};

const TopicVersionListItem = ({ version, intl, number, topicId, storyCounts }) => (
  <div className="topic-version-list-item">
    <Row>
      <Col lg={2}>
        <div className="topic-version-list-title">
          <LinkWithFilters to={`/topics/${topicId}/summary`} filters={{ snapshotId: version.snapshots_id }}>
            <h2><FormattedHTMLMessage {...localMessages.versionNumber} values={{ number, status: version.state }} /></h2>
          </LinkWithFilters>
          <small>
            <FormattedDate value={version.snapshotDate} month="short" year="numeric" day="numeric" />
          </small>
        </div>
      </Col>
      <Col lg={6}>
        <div className="topic-version-list-info">
          <h2><FormattedHTMLMessage {...messageForVersionState(version.state)} /></h2>
          {detailsForVersionState(version, storyCounts, intl.formatMessage, intl.formatNumber)}
          <br />
          <LinkWithFilters to={`/topics/${topicId}/summary`} filters={{ snapshotId: version.snapshots_id }}>
            <AppButton
              type="submit"
              label={versionSelectText(version.state, number, intl.formatMessage)}
            />
          </LinkWithFilters>
        </div>
      </Col>
    </Row>
  </div>
);

TopicVersionListItem.propTypes = {
  // from parent
  number: PropTypes.number.isRequired,
  version: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  storyCounts: PropTypes.object.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVersionListItem
);
