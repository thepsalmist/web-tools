import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl } from 'react-intl';
import ReleaseNotes from './ReleaseNotes';

const localMessages = {
  releaseNotes: { id: 'recentNews.releaseNotes', defaultMessage: 'Release Notes' },
};

const RecentNews = props => (
  <div className="recent-news">
    <Grid>
      <Row>
        <Col lg={12}>
          <h1><FormattedMessage {...localMessages.releaseNotes} /></h1>
        </Col>
      </Row>
      {props.recentNews.releases.map(release => <ReleaseNotes release={release} key={release.version} />)}
    </Grid>
  </div>
);

RecentNews.propTypes = {
  // from parent
  recentNews: PropTypes.object,
};

export default
injectIntl(
  RecentNews
);
