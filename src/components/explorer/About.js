import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ExplorerMarketingFeatureList from './home/ExplorerMarketingFeatureList';
import messages from '../../resources/messages';
import AppButton from '../common/AppButton';
import { urlToExplorer } from '../../lib/urlUtil';
import PageTitle from '../common/PageTitle';

const localMessages = {
  pageTitle: { id: 'about.pageTitle', defaultMessage: 'About' },
  aboutTitle: { id: 'about.title', defaultMessage: 'About Explorer' },
  aboutText: { id: 'about.text', defaultMessage: 'Explore our media tools!' },
};

const About = () => (
  <div className="about">
    <Grid>
      <PageTitle value={localMessages.pageTitle} />
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
        </Col>
        <Row>
          <Col lg={12}>
            <p className="subtitle"><FormattedMessage {...messages.explorerToolDescription} /></p>
          </Col>
        </Row>
      </Row>
    </Grid>
    <Grid>
      <Row>
        <Col lg={10} md={10} sm={10} />
        <Col m={2} lg={2}>
          <AppButton color="primary" primary onClick={() => { window.location = urlToExplorer('queries/search?q=[{"label":"*","q":"*","color":"%231f77b4","sources":[],"collections":[58722749]}]'); }}>
            <FormattedMessage {...messages.tryItNow} />
          </AppButton>
        </Col>
      </Row>
    </Grid>
    <ExplorerMarketingFeatureList />
  </div>
);

About.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(About);
