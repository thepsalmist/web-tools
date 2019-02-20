import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../common/PageTitle';
import AppButton from '../../common/AppButton';
import TopicInfo from '../controlbar/TopicInfo';
import TopicStoryInfo from '../controlbar/TopicStoryInfo';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
};

const TopicVersionStatusContainer = props => (
  <Grid>
    <PageTitle value={localMessages.title} />
    <Row>
      <Col lg={6}>
        <AppButton
          primary
        />
      </Col>
      <Col lg={6}>
        <TopicInfo topic={props.topicInfo} />
        <TopicStoryInfo topic={props.topicInfo} filters={props.filters} />
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
