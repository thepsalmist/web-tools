import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../common/PageTitle';
import AppButton from '../../common/AppButton';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
};

const TopicVersionStatusContainer = () => (
  <Grid>
    <PageTitle value={localMessages.title} />
    <Row>
      <Col lg={6}>
        <AppButton
          primary
        />
      </Col>
    </Row>
  </Grid>
);

TopicVersionStatusContainer.propTypes = {
  // from state
  topicInfo: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVersionStatusContainer
);
