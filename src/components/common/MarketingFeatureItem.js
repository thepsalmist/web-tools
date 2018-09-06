import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { assetUrl } from '../../lib/assetUtil';

const MarketingFeatureItem = (props) => {
  const { titleMsg, contentMsg, imageOnLeft, imageName } = props;
  const { formatMessage } = props.intl;
  const textContent = (
    <Col lg={5} xs={12}>
      <h2><FormattedMessage {...titleMsg} /></h2>
      <FormattedHTMLMessage {...contentMsg} />
    </Col>
  );
  const imgContent = (
    <Col lg={4} xs={12}>
      <img src={assetUrl(`/static/img/marketing/${imageName}`)} alt={formatMessage(titleMsg)} width={410} />
    </Col>
  );
  let content;
  if (imageOnLeft) {
    content = (
      <Row>
        <Col lg={1} />
        {imgContent}
        <Col lg={1} />
        {textContent}
      </Row>
    );
  } else {
    content = (
      <Row>
        <Col lg={1} />
        {textContent}
        <Col lg={1} />
        {imgContent}
      </Row>
    );
  }
  const className = (imageOnLeft) ? 'image-on-left' : 'image-on-right';
  return (
    <div className={`marketing-feature-item ${className}`}>
      <Grid>
        {content}
      </Grid>
    </div>
  );
};

MarketingFeatureItem.propTypes = {
  intl: PropTypes.object.isRequired,
  // form parent
  imageOnLeft: PropTypes.bool,
  titleMsg: PropTypes.object.isRequired,
  contentMsg: PropTypes.object.isRequired,
  imageName: PropTypes.string,
};

export default
injectIntl(
  MarketingFeatureItem
);
