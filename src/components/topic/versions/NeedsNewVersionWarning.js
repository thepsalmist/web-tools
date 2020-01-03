import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { WarningNotice } from '../../common/Notice';
import LinkWithFilters from '../LinkWithFilters';

const localMessages = {
  needsNewSnapshot: { id: 'topic.needsNewSnapshot.subtopics', defaultMessage: 'You\'ve changed some subtopics and need to generate a new version!' },
  needsNewSnapshotAction: { id: 'topic.needsNewSnapshot.subtopics.action', defaultMessage: 'Review Changes' },
};

// TODO: move this into a reducer
export function needsNewVersion(usingLatest, newDefinitions, latestVersionRunning) {
  return usingLatest && newDefinitions && !latestVersionRunning;
}

export function placeholderNewPlatformNeedsNewVersion(usingLatest, newPlatforms, latestVersionRunning) {
  const forceDisplay = usingLatest && newPlatforms && !latestVersionRunning;
  return !forceDisplay;
}

const NeedsNewVersionWarning = ({ topicId, newDefinitions, latestVersionRunning, usingLatest }) => (
  <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
    {needsNewVersion(usingLatest, newDefinitions, latestVersionRunning) && (
      <div className="warning-background">
        <Grid>
          <Row>
            <Col lg={12}>
              <WarningNotice>
                <FormattedMessage {...localMessages.needsNewSnapshot} />
                <LinkWithFilters to={`/topics/${topicId}/snapshot/foci`}>
                  <AppButton label={localMessages.needsNewSnapshotAction} />
                </LinkWithFilters>
              </WarningNotice>
            </Col>
          </Row>
        </Grid>
      </div>
    )}
  </Permissioned>
);

NeedsNewVersionWarning.propTypes = {
  // from state
  usingLatest: PropTypes.bool.isRequired,
  newDefinitions: PropTypes.bool.isRequired,
  latestVersionRunning: PropTypes.bool.isRequired,
  topicId: PropTypes.number.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  usingLatest: state.topics.selected.snapshots.usingLatest,
  newDefinitions: state.topics.selected.focalSets.all.newDefinitions,
  latestVersionRunning: state.topics.selected.snapshots.latestVersionRunning,
});

export default
injectIntl(
  connect(mapStateToProps)(
    NeedsNewVersionWarning
  )
);
