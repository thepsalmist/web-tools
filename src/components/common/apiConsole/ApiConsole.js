import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import SwaggerContainer from './SwaggerContainer';

const localMessages = {
  title: { id: 'apiConsole.title', defaultMessage: 'Try Out the Media Cloud API' },
  intro: { id: 'apiConsole.intro', defaultMessage: 'All of our data is available programatically via our API. If you are a coder, you can fetch data directly from our system using a variety of endpoints.  The console below lets you browse and try out many of our most useful API endpoints.  If you are planning to go this route and work in the Python programming language, do check out our <a target=_new href="https://pypi.org/project/mediacloud/">Python API CLient</a>.' },
};

const ApiConsole = () => (
  <Grid>
    <Row>
      <Col lg={8}>
        <h1><FormattedMessage {...localMessages.title} /></h1>
        <p><FormattedHTMLMessage {...localMessages.intro} /></p>
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <SwaggerContainer specUrl="/static/api-spec.json" />
      </Col>
    </Row>
  </Grid>
);

export default injectIntl(ApiConsole);
