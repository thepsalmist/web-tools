import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../common/AppButton';
import { WarningNotice } from '../../../common/Notice';
import SeedQuerySummary from '../SeedQuerySummary';
import LinkWithFilters from '../../LinkWithFilters';
import JobDate from '../JobDate';

const localMessages = {
  title: { id: 'version.running.title', defaultMessage: 'Version {number} - Still Generating' },
  cancelTopic: { id: 'version.cancel', defaultMessage: 'Cancel This Version' },
  explanationTitle: { id: 'version.running.explanation.title', defaultMessage: 'What\'s Happening?' },
  explanationText: { id: 'version.running.explanation.text', defaultMessage: 'Your topic started off with {seedStoryCount} stories from our existing database that matching its seed query. We are following the links in those stories to discover more.  Each of these new stories will be checked to see if it matches your search terms.  If it does, we will include it in your topic.  If it doesn\'t then we will ignore it. We generally find that just 10% to 15% of the links we follow from your seed stories get included in the final topic.' },
  cancelDetails: { id: 'version.running.cancel.details', defaultMessage: 'If you seed query doesn\'t look right then you should cancel generating this version and make a new one.' },
  seeOtherVersions: { id: 'version.seeOtherVersions', defaultMessage: 'See Other Versions' },
  seeOtherVersionsDetails: { id: 'version.running.seeOtherVersions.details', defaultMessage: 'While you wait for this version to finish generating, you can browse any previous versions of your topic.' },
  jobDate: { id: 'version.running.jobDate', defaultMessage: 'Last updated {date}' },
};

const TopicVersionRunningStatusContainer = ({ topic, snapshot, job, intl }) => (
  <Grid>
    {snapshot.note !== topic.latestVersion && <WarningNotice><FormattedMessage {...localMessages.versionError} /></WarningNotice>}
    <div className="topic-version-status-container">
      <Row>
        <Col lg={6}>
          <h1><FormattedMessage {...localMessages.title} values={{ number: snapshot.note }} /></h1>
          <JobDate snapshot={snapshot} job={job} />
          <h2>
            <FormattedMessage {...localMessages.explanationTitle} />
          </h2>
          <p><FormattedMessage {...localMessages.explanationText} values={{ seedStoryCount: intl.formatNumber(topic.seed_query_story_count) }} /></p>

          <LinkWithFilters to={`/topics/${topic.topics_id}/versions`}>
            <AppButton label={intl.formatMessage(localMessages.seeOtherVersions)} primary />
          </LinkWithFilters>

          <p><FormattedMessage {...localMessages.seeOtherVersionsDetails} /></p>
          { /*
          <AppButton label={intl.formatMessage(localMessages.cancelTopic)} />
          <p><FormattedMessage {...localMessages.cancelDetails} /></p>
          */ }
        </Col>
        <Col lg={1} />
        <Col lg={5}>
          <SeedQuerySummary topic={topic} snapshot={snapshot} />
        </Col>
      </Row>
    </div>
  </Grid>
);

TopicVersionRunningStatusContainer.propTypes = {
  // from state
  topic: PropTypes.object.isRequired,
  snapshot: PropTypes.object,
  job: PropTypes.object,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TopicVersionRunningStatusContainer
);
