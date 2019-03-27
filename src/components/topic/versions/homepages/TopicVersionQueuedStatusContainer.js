import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import PageTitle from '../../../common/PageTitle';
import SeedQuerySummary from '../SeedQuerySummary';
import JobDate from './JobDate';
import VersionGenerationProcess from './VersionGenerationProcess';

const localMessages = {
  title: { id: 'version.queued.title', defaultMessage: 'Version {number} - Queued' },
  explanationTitle: { id: 'version.queued.explanation.title', defaultMessage: 'What\'s Happening?' },
  explanationText: { id: 'version.queued.explanation.text', defaultMessage: 'We have a small number of servers that run all our software.  To make sure that no single project monopolizes all of them, we have a queue for running topics people create. Your request to make a new version of this topic is now in that queue. We can\'t really estimate how long until your topic finished running, but it usually doesn\'t take more than a few days.' },
  whatNowTitle: { id: 'version.queued.explanation2.title', defaultMessage: 'Made a Mistake?' },
  whatNowText: { id: 'version.queued.explanation2.text', defaultMessage: 'Does that query on the right look wrong? Did you not need this version of the topic anymore?  You can cancel it.' },
};

const TopicVersionCreatedStatusContainer = ({ topic, snapshot, job, intl }) => (
  <React.Fragment>
    <PageTitle value={intl.formatMessage(localMessages.title, { number: snapshot.note })} />
    <div className="topic-version-status-container">
      <Grid>
        <Row>
          <Col lg={6}>
            <h1><FormattedMessage {...localMessages.title} values={{ number: snapshot.note }} /></h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <VersionGenerationProcess snapshot={snapshot} topic={topic} />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <JobDate snapshot={snapshot} job={job} />
            <h2><FormattedMessage {...localMessages.explanationTitle} /></h2>
            <p><FormattedMessage {...localMessages.explanationText} /></p>

            {/*
            <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
              <h2><FormattedMessage {...localMessages.whatNowTitle} /></h2>
              <p><FormattedMessage {...localMessages.whatNowText} /></p>
                <AppButton
                  label={intl.formatMessage(messages.cancel)}
                  onClick={showDialog}
                />
            </Permissioned>
            */}

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
