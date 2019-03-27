import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../../../common/AppButton';
import PageTitle from '../../../common/PageTitle';
import Permissioned from '../../../common/Permissioned';
import { PERMISSION_TOPIC_WRITE } from '../../../../lib/auth';
import SeedQuerySummary from '../SeedQuerySummary';
import messages from '../../../../resources/messages';
import JobDate from './JobDate';
import VersionGenerationProcess from './VersionGenerationProcess';

const localMessages = {
  title: { id: 'version.error.title', defaultMessage: 'Version {number} - <span class="error-background">Error</span>' },
  explanationTitle: { id: 'version.error.explanation.title', defaultMessage: 'What\'s the Problem?' },
  explanationText: { id: 'version.error.explanation.text', defaultMessage: 'Something went wrong while your topic was running.' },
  whatNowTitle: { id: 'version.error.explanation2.title', defaultMessage: 'What Should I Do Now?' },
  whatNowText: { id: 'version.error.explanation2.text', defaultMessage: 'Nothing! We\'ve been notified, and will take a look at it.  If you don\'t hear from us soon, do drop us a line at support@mediacloud.org.' },
};

const TopicVersionErrorStatusContainer = ({ topic, goToCreateNewVersion, snapshot, job, intl }) => (
  <React.Fragment>
    <PageTitle value={intl.formatMessage(localMessages.title, { number: snapshot.note })} />
    <div className="topic-version-status-container">
      <Grid>
        <Row>
          <Col lg={12}>
            <h1><FormattedHTMLMessage {...localMessages.title} values={{ number: snapshot.note }} /></h1>
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
            <h2><FormattedMessage {...localMessages.whatNowTitle} /></h2>
            <p><FormattedMessage {...localMessages.whatNowText} /></p>

            <Permissioned onlyTopic={PERMISSION_TOPIC_WRITE}>
              <div className="topic-stuck-created-or-error">
                <AppButton
                  label={intl.formatMessage(messages.createNewVersion)}
                  onClick={() => goToCreateNewVersion(topic.topics_id)}
                  type="submit"
                  primary
                />
              </div>
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

TopicVersionErrorStatusContainer.propTypes = {
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
  TopicVersionErrorStatusContainer
);
