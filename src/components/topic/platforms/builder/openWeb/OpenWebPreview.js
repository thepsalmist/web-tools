import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import OpenWebStoryCountPreviewContainer from './OpenWebStoryCountPreviewContainer';
import OpenWebStoryPreviewContainer from './OpenWebStoryPreviewContainer';

const localMessages = {
  about: { id: 'focus.create.keyword.results.about',
    defaultMessage: 'Here is a preview of total number of stories we have found that match your query within the overall topic.' },
};

const OpenWebPreview = (props) => {
  const { topicId, topicInfo, query } = props;
  return (
    <div className="platform-create-open-web-preview">
      <Row>
        <Col lg={10}>
          <OpenWebStoryCountPreviewContainer topicId={topicId} topicInfo={topicInfo} query={query} />
        </Col>
        <Col lg={2}>
          <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <OpenWebStoryPreviewContainer topicId={topicId} query={query} />
        </Col>
      </Row>
    </div>
  );
};

OpenWebPreview.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  query: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
};

export default injectIntl(OpenWebPreview);
