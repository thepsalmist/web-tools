import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import AppButton from '../common/AppButton';
import TopicsMarketingFeatureList from './homepage/TopicsMarketingFeatureList';
import messages from '../../resources/messages';
import { urlToTopicMapper } from '../../lib/urlUtil';

const localMessages = {
  aboutTitle: { id: 'about.title', defaultMessage: 'About Topic Mapper' },
  aboutText: { id: 'about.text', defaultMessage: 'Topic Mapper lets you analyze how online media talks about a topic.' },
};

const About = (props) => {
  const title = props.intl.formatMessage(localMessages.aboutTitle);
  return (
    <div className="about">
      <Grid>
        <Helmet><title>{title}</title></Helmet>
        <Row>
          <Col lg={6} md={6} sm={6}>
            <h1><FormattedMessage {...localMessages.aboutTitle} /></h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <p className="subtitle"><FormattedMessage {...messages.topicsToolDescription} /></p>
          </Col>
        </Row>
      </Grid>
      <Grid>
        <Row>
          <Col lg={10} md={10} sm={10} />
          <Col m={2} lg={2}>
            <AppButton color="primary" primary onTouchTap={() => { window.location = urlToTopicMapper('home'); }}>
              <FormattedMessage {...messages.tryItNow} />
            </AppButton>
          </Col>
        </Row>
      </Grid>
      <TopicsMarketingFeatureList />
    </div>
  );
};


About.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    About
  );
