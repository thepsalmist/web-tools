import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import SeedQuerySummary from '../SeedQuerySummary';
import JobDate from './JobDate';
import JobList from './JobList';
import VersionGenerationProcess from './VersionGenerationProcess';

const localMessages = {
  title: { id: 'version.running.title', defaultMessage: 'Version {number} - ' },
};

const TopicVerionStatus = ({ topic, snapshot, job, subtitle, children }) => (
  <Grid>
    <div className="topic-version-status">
      <Row>
        <Col lg={12}>
          <h1>
            <FormattedMessage {...localMessages.title} values={{ number: snapshot.note }} />
            <FormattedHTMLMessage {...subtitle} />
          </h1>
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
          {children}
          <JobList jobs={[...topic.spiderJobs, ...((snapshot.jobs) ? snapshot.jobs : [])]} />
        </Col>
        <Col lg={1} />
        <Col lg={5}>
          <SeedQuerySummary topic={topic} snapshot={snapshot} />
        </Col>
      </Row>
    </div>
  </Grid>
);

TopicVerionStatus.propTypes = {
  // from state
  subtitle: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  topic: PropTypes.object.isRequired,
  snapshot: PropTypes.object,
  job: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVerionStatus
);
