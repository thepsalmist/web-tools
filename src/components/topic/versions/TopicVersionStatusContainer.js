import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../common/PageTitle';
import AppButton from '../../common/AppButton';
import TopicInfo from '../controlbar/TopicInfo';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
  label: { id: 'topics.status.runningOrQueued', defaultMessage: 'Your topic is {state}' },
  cancelTopic: { id: 'topics.status.cancel', defaultMessage: 'Cancel This Topic' },
};

const TopicVersionStatusContainer = props => (
  <Grid>
    <PageTitle value={localMessages.title} />
    <h2>{props.intl.formatMessage(localMessages.label, { state: props.topicInfo.state })}</h2>
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
  filters: PropTypes.object,
  topicInfo: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVersionStatusContainer
);
