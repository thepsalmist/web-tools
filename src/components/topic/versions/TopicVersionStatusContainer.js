import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../common/PageTitle';
import AppButton from '../../common/AppButton';
import TopicInfo from '../controlbar/TopicInfo';
import { getUserRoles, hasPermissions, PERMISSION_ADMIN } from '../../../lib/auth';
import { getCurrentVersionFromSnapshot, getTotalVersions } from '../../../lib/topicVersionUtil';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
  label: { id: 'topics.status.runningOrQueued', defaultMessage: 'Your topic is {state}' },
  cancelTopic: { id: 'topics.status.cancel', defaultMessage: 'Cancel This Topic' },
  versionInfo: { id: 'topics.status.versionInfo', defaultMessage: 'You are viewing Version {latestVersion} out of {numVersions} versions for this topic.' },
};

const TopicVersionStatusContainer = props => (
  <Grid>
    <PageTitle value={localMessages.title} />
    <h2>{props.intl.formatMessage(localMessages.label, { state: hasPermissions(getUserRoles(props.user), PERMISSION_ADMIN) ? props.topicInfo.state : props.displayState })}</h2>
    <h3>{props.intl.formatMessage(localMessages.versionInfo, { latestVersion: getCurrentVersionFromSnapshot(props.topicInfo, props.currentVersion), numVersions: getTotalVersions(props.topicInfo) })}</h3>
    <Row>
      <Col lg={6}>
        <AppButton
          label={props.intl.formatMessage(localMessages.cancelTopic)}
          primary
        />
      </Col>
      <Col lg={6}>
        <TopicInfo topic={props.topicInfo} />
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
