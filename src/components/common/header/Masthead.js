import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../../../resources/messages';

const Masthead = props => (
  <div className="masthead">
    <Grid>
      <Row>
        <Col lg={1} />
        <Col lg={5}>
          <h2><FormattedMessage {...props.nameMsg} /></h2>
          <p><FormattedMessage {...props.descriptionMsg} /></p>
        </Col>
        <Col lg={2} />
        <Col lg={3}>
          <a className="user-guide" href={props.link}><FormattedMessage {...messages.readGuide} /></a>
        </Col>
      </Row>
    </Grid>
  </div>
);

Masthead.propTypes = {
  nameMsg: PropTypes.object.isRequired,
  descriptionMsg: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};

export default
injectIntl(
  Masthead
);
