import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TopicStoryCountPreview from './TopicStoryCountPreview';
import TopicAttentionPreview from './TopicAttentionPreview';
import TopicStorySamplePreview from './TopicStorySamplePreview';
import TopicWordsPreview from './TopicWordsPreview';

const TopicCreatePreview = (props) => {
  const { formData } = props;

  return (
    <div className="topic-container">
      <TopicStoryCountPreview query={formData} />
      <TopicAttentionPreview query={formData} />
      <TopicWordsPreview query={formData} />
      <TopicStorySamplePreview query={formData} />
    </div>
  );
};

TopicCreatePreview.propTypes = {
  // from context
  intl: PropTypes.object.isRequired,
  // from parent
  formData: PropTypes.object,
};

export default
injectIntl(
  TopicCreatePreview
);
