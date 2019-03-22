import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../common/AppButton';
import PageTitle from '../../../common/PageTitle';
import Permissioned from '../../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../../lib/auth';
import SeedQuerySummary from '../SeedQuerySummary';
import messages from '../../../../resources/messages';
import JobDate from './JobDate';
import LinkWithFilters from '../../LinkWithFilters';

const localMessages = {
  title: { id: 'version.error.title', defaultMessage: 'Version {number} - Created' },
  explanationTitle: { id: 'version.error.explanation.title', defaultMessage: 'What\'s Going On?' },
  explanationText: { id: 'version.error.explanation.text', defaultMessage: 'You\'ve created a topic version, but haven\'t started generating it; it is empty. This can be helpul if you want to make any changes before you start filling it up with matching stories.' },
  whatNowTitle: { id: 'version.error.explanation2.title', defaultMessage: 'What Should I Do Now?' },
  whatNowText: { id: 'version.error.explanation2.text', defaultMessage: 'This is the right time to start adding any subtopics that you already know that you\'ll need. Once you\'re ready, click the "generate" button below to start filling up your topic with matching stories.' },
};

const TopicVersionCreatedStatusContainer = ({ topic, goToCreateNewVersion, snapshot, job, intl }) => (
  <React.Fragment>
    <PageTitle value={intl.formatMessage(localMessages.title, { number: snapshot.note })} />
    <div className="topic-version-status-container">
      <Grid>
        <Row>
          <Col lg={6}>
            <h1><FormattedMessage {...localMessages.title} values={{ number: snapshot.note }} /></h1>
            <JobDate snapshot={snapshot} job={job} />

            <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
              <h2><FormattedMessage {...localMessages.explanationTitle} /></h2>
              <p><FormattedMessage {...localMessages.explanationText} /></p>
              <h2><FormattedMessage {...localMessages.whatNowTitle} /></h2>
              <p><FormattedMessage {...localMessages.whatNowText} /></p>
              <LinkWithFilters to={`/topics/${topic.topics_id}/snapshots/foci`}>
                <AppButton
                  label={intl.formatMessage(messages.manageFoci)}
                />
              </LinkWithFilters>
              <br />
              <AppButton
                label={intl.formatMessage(messages.runThisVersion)}
                onClick={goToCreateNewVersion}
                type="submit"
                primary
              />
            </Permissioned>
          </Col>
          <Col lg={1} />
          <Col lg={5}>
            <SeedQuerySummary topic={topic} snapshot={snapshot} />
          </Col>
        </Row>
      </Grid>
    </div>
  </React.Fragment>
);

TopicVersionCreatedStatusContainer.propTypes = {
  // from state
  topic: PropTypes.object,
  filters: PropTypes.object,
  snapshot: PropTypes.object,
  job: PropTypes.object,
  goToCreateNewVersion: PropTypes.func,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVersionCreatedStatusContainer
);
