import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import PlatformTotalContentPreviewContainer from './PlatformTotalContentPreviewContainer';
import PlatformAttentionPreviewContainer from './PlatformAttentionPreviewContainer';
import PlatformWordsPreviewContainer from './PlatformWordsPreviewContainer';
import PlatformContentPreviewContainer from './PlatformContentPreviewContainer';

const OpenWebPreview = ({ topic, query, formatPlatformOpenWebChannelData }) => (
  <div className="platform-create-open-web-preview">
    <Row>
      <Col lg={12}>
        <PlatformTotalContentPreviewContainer
          topic={topic}
          query={query}
          formatPlatformChannelData={formatPlatformOpenWebChannelData}
        />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <PlatformAttentionPreviewContainer
          topic={topic}
          query={query}
          formatPlatformChannelData={formatPlatformOpenWebChannelData}
        />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <PlatformWordsPreviewContainer
          topic={topic}
          query={query}
          formatPlatformChannelData={formatPlatformOpenWebChannelData}
        />
      </Col>
    </Row>
    <Row>
      <Col lg={12}>
        <PlatformContentPreviewContainer
          topic={topic}
          query={query}
          formatPlatformChannelData={formatPlatformOpenWebChannelData}
        />
      </Col>
    </Row>
  </div>
);

OpenWebPreview.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  topic: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  formatPlatformOpenWebChannelData: PropTypes.func,
};

export default injectIntl(OpenWebPreview);
