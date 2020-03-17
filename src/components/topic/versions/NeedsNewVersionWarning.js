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
import { PLATFORM_OPEN_WEB } from '../../../lib/platformTypes';


const localMessages = {
  needsNewSnapshot: { id: 'topic.needsNewSnapshot.subtopics', defaultMessage: 'You\'ve changed this topic and need to generate a new version!' },
  needsNewSnapshotAction: { id: 'topic.needsNewSnapshot.subtopics.action', defaultMessage: 'Review Changes' },
};

// TODO: move this into a reducer when we've accounted for all cases
// latestUsableSnapshot === null accounts for an empty topic with no snapshot...
export function needsNewVersion(usingLatest, newDefinitions, latestVersionRunning) {
  return (usingLatest && newDefinitions && !latestVersionRunning);
}

export function placeholderNewPlatformNeedsNewVersion(usingLatest, currentPlatforms, newPlatforms, latestVersionRunning, latestUsableSnapshot) {
  // if different amount of platforms
  const differentAmount = currentPlatforms.length !== newPlatforms.length;
  // new platform doesn't exist in currentTitle
  const newOneThere = newPlatforms.filter(newPlatform => currentPlatforms.filter(
    currentPlatform => (currentPlatform.platform === newPlatform.platform) && (currentPlatform.source === newPlatform.source)
  ).length === 0).length > 0;
  // current platform doesn't exist in new
  const oldOneGone = currentPlatforms.filter(currentPlatform => newPlatforms.filter(
    newPlatform => (currentPlatform.platform === newPlatform.platform) && (currentPlatform.source === newPlatform.source)
  ).length === 0).length > 0;
  // queries different in any of same platforms (TODO: make this work on all platforms, not just web)
  const oldWeb = currentPlatforms.filter(p => p.platform === PLATFORM_OPEN_WEB);
  const oldWebQuery = (oldWeb.length > 0) ? oldWeb[0].query : '';
  const newWeb = newPlatforms.filter(p => p.platform === PLATFORM_OPEN_WEB);
  const newWebQuery = (newWeb.length > 0) ? newWeb[0].query : '';
  const differentQuery = newWebQuery !== oldWebQuery;
  // now combine logic
  const thereAreNewPlatforms = differentAmount || newOneThere || oldOneGone || differentQuery;
  const forceDisplay = (usingLatest && thereAreNewPlatforms && !latestVersionRunning) || latestUsableSnapshot === null;
  return forceDisplay;
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
