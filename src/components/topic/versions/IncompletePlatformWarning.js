import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import Permissioned from '../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../lib/auth';
import { WarningNotice } from '../../common/Notice';
import AppButton from '../../common/AppButton';
import LinkWithFilters from '../LinkWithFilters';

const localMessages = {
  platformIncompleteNeedsNewVersion: { id: 'topic.incomplete', defaultMessage: 'You\'ve created a new topic and need to set up an Open Web platform. Then you will need to create a new version!' },
};

export function platformIncomplete(initializedPlatform) {
  return !initializedPlatform;
}

const IncompletePlatformWarning = ({ initializedPlatform, msg, topicId }) => {
  const warning = msg || localMessages.platformIncompleteNeedsNewVersion;
  return (
    <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
      {platformIncomplete(initializedPlatform) && (
        <div className="notice warning-background">
          <Grid>
            <Row>
              <Col lg={12}>
                <WarningNotice>
                  <FormattedMessage {...warning} />
                  {window.location.href.indexOf('platforms') === -1 && (
                    <LinkWithFilters to={`/topics/${topicId}/platforms/manage`}>
                      <AppButton label={localMessages.needsNewSnapshotAction} />
                    </LinkWithFilters>
                  )}
                </WarningNotice>
              </Col>
            </Row>
          </Grid>
        </div>
      )}
    </Permissioned>
  );
};

IncompletePlatformWarning.propTypes = {
  // from state
  initializedPlatform: PropTypes.bool.isRequired,
  topicId: PropTypes.number.isRequired,
  msg: PropTypes.object,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  initializedPlatform: state.topics.selected.platforms.all.initialized,
});

export default
injectIntl(
  connect(mapStateToProps)(
    IncompletePlatformWarning
  )
);
