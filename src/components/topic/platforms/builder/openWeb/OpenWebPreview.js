import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import OpenWebStoryCountPreviewContainer from './OpenWebStoryCountPreviewContainer';
import OpenWebAttentionPreviewContainer from './OpenWebAttentionPreviewContainer';
import OpenWebWordsPreview from './OpenWebWordsPreview';

const localMessages = {
  about: { id: 'focus.create.keyword.results.about',
    defaultMessage: 'Here is a preview of total number of stories we have found that match your query within the overall topic.' },
};

const OpenWebPreview = () => (
  <div className="platform-create-open-web-preview">
    <Row>
      <Col lg={8}>
        <OpenWebStoryCountPreviewContainer />
      </Col>
      <Col lg={4}>
        <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <OpenWebAttentionPreviewContainer />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <OpenWebWordsPreview />
      </Col>
    </Row>
  </div>
);

OpenWebPreview.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
};

export default injectIntl(OpenWebPreview);
