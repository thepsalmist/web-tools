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
  needsNewSnapshotAction: { id: 'topic.needsNewSnapshot.subtopics.action', defaultMessage: 'Finish up and generate' },
};

const NeedsNewVersionWarning = ({ topicId, newDefinitions, latestVersionRunning, usingLatest }) => (
  <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
    {usingLatest && newDefinitions && !latestVersionRunning && (
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
  newDefinitions: state.topics.selected.focalSets.all.newDefinitions,
  latestVersionRunning: state.topics.selected.snapshots.latestVersionRunning,
  usingLatest: state.topics.selected.snapshots.usingLatest,
});

export default
injectIntl(
  connect(mapStateToProps)(
    NeedsNewVersionWarning
  )
);
