import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

const About = ({ defaultCollectionTag }) => (
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
                [defaultCollectionTag],
                '2020-01-01',
                '2021-01-01',
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
  // from store
  defaultCollectionTag: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  defaultCollectionTag: state.system.staticTags.tags.defaultCollectionTag,
});

export default
injectIntl(
  connect(mapStateToProps)(
    About
  )
);
