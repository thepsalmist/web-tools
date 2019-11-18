import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid/lib';
import RedditStoryCountPreviewContainer from './RedditStoryCountPreviewContainer';
import RedditStoryPreviewContainer from './RedditStoryPreviewContainer';

const localMessages = {
  about: { id: 'focus.create.keyword.results.about',
    defaultMessage: 'Here is a preview of total number of stories we have found that match your query within the overall topic.' },
};

const RedditPreview = (props) => {
  const { topicId, query } = props;
  return (
    <div className="platform-create-open-web-preview">
      <Row>
        <Col lg={10}>
          <RedditStoryCountPreviewContainer topicId={topicId} query={query} />
        </Col>
        <Col lg={2}>
          <p className="light"><i><FormattedMessage {...localMessages.about} /></i></p>
        </Col>
      </Row>
      <Row>
        <Col lg={10} md={10} xs={12}>
          <RedditStoryPreviewContainer topicId={topicId} query={query} />
        </Col>
      </Row>
    </div>
  );
};

RedditPreview.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  query: PropTypes.string.isRequired,
  topicId: PropTypes.number.isRequired,
};

export default injectIntl(RedditPreview);
