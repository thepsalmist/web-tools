import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import ExplorerMarketingFeatureList from './home/ExplorerMarketingFeatureList';
import messages from '../../resources/messages';
import AppButton from '../common/AppButton';
import { urlToExplorerQuery } from '../../lib/urlUtil';
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
        <Col lg={10} />
        <Col lg={2}>
          <AppButton
            primary
            onClick={() => {
              window.location = urlToExplorerQuery(
                'election news',
                'election*',
                [],
                [58722749],
                '2019-01-01',
                '2020-01-01',
              );
            }}
          >
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
