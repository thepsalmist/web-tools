import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../common/AppButton';
import SourcesMarketingFeatureList from './homepage/SourcesMarketingFeatureList';
import messages from '../../resources/messages';
import { urlToSourceManager } from '../../lib/urlUtil';
import PageTitle from '../common/PageTitle';

const localMessages = {
  pageTitle: { id: 'about.pageTitle', defaultMessage: 'About' },
  aboutTitle: { id: 'about.title', defaultMessage: 'About Source Manager' },
  aboutText: { id: 'about.text', defaultMessage: 'Browse the media sources and collections in our database, and suggest more to add.' },
};

const About = () => (
  <div className="about">
    <Grid>
      <PageTitle value={localMessages.pageTitle} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <p className="subtitle"><FormattedMessage {...messages.sourcesToolDescription} /></p>
        </Col>
      </Row>
    </Grid>
    <Grid>
      <Row>
        <Col lg={10} md={10} sm={10} />
        <Col m={2} lg={2}>
          <AppButton color="primary" primary onClick={() => { window.location = urlToSourceManager('home'); }}>
            <FormattedMessage {...messages.tryItNow} />
          </AppButton>
        </Col>
      </Row>
    </Grid>
    <SourcesMarketingFeatureList />
  </div>
);


About.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(About);
