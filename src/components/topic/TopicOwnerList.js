import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../../resources/messages';

const localMessages = {
  createdBy: { id: 'topic.createdBy', defaultMessage: 'Created by: ' },
};

const TopicOwnerList = (props) => {
  const { owners } = props;
  let ownerListContent;
  if (owners.length > 0) {
    ownerListContent = owners.map(u => u.full_name).join(', ');
  } else {
    ownerListContent = <FormattedMessage {...messages.unknown} />;
  }
  return (
    <div className="topic-owner-list">
      <p><FormattedMessage {...localMessages.createdBy} /><i>{ownerListContent}</i></p>
    </div>
  );
};

TopicOwnerList.propTypes = {
  // from parent
  owners: PropTypes.array.isRequired,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TopicOwnerList);
