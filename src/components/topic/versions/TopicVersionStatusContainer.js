import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../common/PageTitle';
import AppButton from '../../common/AppButton';
import { WarningNotice } from '../../common/Notice';
import TopicInfo from '../controlbar/TopicInfo';
import { getUserRoles, hasPermissions, PERMISSION_ADMIN } from '../../../lib/auth';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
  label: { id: 'topics.status.runningOrQueued', defaultMessage: 'Your version is {state}' },
  cancelTopic: { id: 'topics.status.cancel', defaultMessage: 'Cancel This Version' },
  versionInfo: { id: 'topics.status.versionInfo', defaultMessage: 'You are viewing {currentVersion} out of {numVersions} versions for this topic.' },
  versionError: { id: 'topics.status.versionError', defaultMessage: 'You are not viewing the latest version for this topic.' },
};

const TopicVersionStatusContainer = props => (
  <Grid>
    <PageTitle value={localMessages.title} />
    {props.currentVersion !== props.topicInfo.latestVersion && <WarningNotice><FormattedMessage {...localMessages.versionError} /></WarningNotice>}
    <h2>{props.intl.formatMessage(localMessages.label, { state: hasPermissions(getUserRoles(props.user), PERMISSION_ADMIN) ? props.topicInfo.state : props.displayState })}</h2>
    <h3>{props.intl.formatMessage(localMessages.versionInfo, { currentVersion: props.currentVersion, numVersions: props.topicInfo.latestVersion })}</h3>
    <Row>
      <Col lg={6}>
        <AppButton
          label={props.intl.formatMessage(localMessages.cancelTopic)}
          primary
        />
      </Col>
      <Col lg={6}>
        <TopicInfo topic={props.topicInfo} currentVersion={props.currentVersion} />
      </Col>
    </Row>
  </Grid>
);

TopicVersionStatusContainer.propTypes = {
  // from state
  currentVersion: PropTypes.number,
  topicInfo: PropTypes.object,
  user: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
  displayState: PropTypes.string,
};

export default
injectIntl(
  TopicVersionStatusContainer
);
