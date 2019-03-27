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
  message: { id: 'topic.notUsingLatest.subtopics', defaultMessage: 'You\'re not using the latest version!' },
  action: { id: 'topic.notUsingLatest.subtopics.action', defaultMessage: 'Switch versions' },
};

const NeedsNewVersionWarning = ({ topicId, usingLatest, latestIsUsable }) => (
  <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
    {!usingLatest && latestIsUsable && (
      <div className="warning-background">
        <Grid>
          <Row>
            <Col lg={12}>
              <WarningNotice>
                <FormattedMessage {...localMessages.message} />
                <LinkWithFilters to={`/topics/${topicId}/versions`}>
                  <AppButton label={localMessages.action} />
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
  latestIsUsable: PropTypes.bool.isRequired,
  topicId: PropTypes.number.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  topicId: state.topics.selected.id,
  latestIsUsable: state.topics.selected.snapshots.latestIsUsable,
  usingLatest: state.topics.selected.snapshots.usingLatest,
});

export default
injectIntl(
  connect(mapStateToProps)(
    NeedsNewVersionWarning
  )
);
