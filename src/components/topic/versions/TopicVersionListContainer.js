import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../../../resources/messages';

const localMessages = {
  createdBy: { id: 'topic.createdBy', defaultMessage: 'Created by: ' },
};

const TopicVersionListContainer = (props) => {
  const { versions } = props;
  let versionListContent;
  if (versions.length > 0) {
    versionListContent = versions.map(u => u.name).join(', ');
  } else {
    versionListContent = <FormattedMessage {...messages.unknown} />;
  }
  return (
    <div className="topic-version-list">
      <p><FormattedMessage {...localMessages.createdBy} /><i>{versionListContent}</i></p>
    </div>
  );
};

TopicVersionListContainer.propTypes = {
  // from parent
  versions: PropTypes.array.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TopicVersionListContainer);
