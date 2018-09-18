import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import KeywordStoryCountPreviewContainer from './KeywordStoryCountPreviewContainer';
import KeywordStoryPreviewContainer from './KeywordStoryPreviewContainer';

const localMessages = {
  about: { id: 'focus.create.keyword.results.about',
    defaultMessage: 'Here is a preview of the top stores in the Timespan of the Topic you are investigating.  Look over these results to make sure they are the types of stories you are hoping this Subtopic will narrow in on.' },
};

const KeywordSearchPreview = (props) => {
  const { topicId, keywords } = props;
  return (
    <div className="focal-create-boolean-keyword-preview">
      <Row>
        <Col lg={4} xs={12}>
          <KeywordStoryCountPreviewContainer topicId={topicId} keywords={keywords} />
        </Col>
        <Col lg={2} md={2} xs={12}>
          <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <KeywordStoryPreviewContainer topicId={topicId} keywords={keywords} />
        </Col>
      </Row>
    </div>
  );
};

KeywordSearchPreview.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  keywords: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
};

export default injectIntl(KeywordSearchPreview);
