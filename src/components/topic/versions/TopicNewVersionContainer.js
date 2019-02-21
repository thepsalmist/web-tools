import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../common/PageTitle';
import AppButton from '../../common/AppButton';

const localMessages = {
  title: { id: 'topics.adminList.title', defaultMessage: 'Admin: Topic Status Dashboard' },
  createNewVersion: { id: 'topics.createNewVersion', defaultMessage: 'Create New Version' },
  addNewSubtopics: { id: 'topics.addNewSubtopics', defaultMessage: 'Add New Subtopics' },
};

const TopicNewVersionContainer = () => (
  <Grid>
    <PageTitle value={localMessages.title} />
    <Row>
      <Col lg={6}>
        <FormattedMessage {...localMessages.createNewVersion} />
        <AppButton
          primary
        />
      </Col>
      <Col lg={6}>
        <FormattedMessage {...localMessages.addNewSubtopics} />
        <AppButton
          primary
        />
      </Col>
    </Row>
  </Grid>
);

TopicNewVersionContainer.propTypes = {
  // from state
  filters: PropTypes.object,
  topicInfo: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicNewVersionContainer
);
