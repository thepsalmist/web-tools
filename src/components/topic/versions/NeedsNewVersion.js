import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../common/AppButton';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { WarningNotice } from '../../common/Notice';

const localMessages = {
  needsNewSnapshot: { id: 'topic.needsNewSnapshot.subtopics', defaultMessage: 'You\'ve changed some subtopics and need to generate a new version!' },
  needsNewSnapshotAction: { id: 'topic.needsNewSnapshot.subtopics.action', defaultMessage: 'Finish up and generate' },
};

const NeedsNewVersion = ({ newDefinitions, latestVersionRunning, usingLatest }) => (
  <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
    {usingLatest && newDefinitions && !latestVersionRunning && (
      <div className="warning-background">
        <Grid>
          <Row>
            <Col lg={12}>
              <WarningNotice>
                <FormattedMessage {...localMessages.needsNewSnapshot} />
                <AppButton label={localMessages.needsNewSnapshotAction} />
              </WarningNotice>
            </Col>
          </Row>
        </Grid>
      </div>
    )}
  </Permissioned>
);

NeedsNewVersion.propTypes = {
  // from state
  usingLatest: PropTypes.bool.isRequired,
  newDefinitions: PropTypes.bool.isRequired,
  latestVersionRunning: PropTypes.bool.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  newDefinitions: state.topics.selected.focalSets.all.newDefinitions,
  latestVersionRunning: state.topics.selected.snapshots.latestVersionRunning,
  usingLatest: state.topics.selected.snapshots.usingLatest,
});

export default
injectIntl(
  connect(mapStateToProps)(
    NeedsNewVersion
  )
);
