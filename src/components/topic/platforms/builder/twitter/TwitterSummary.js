import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

const NEW_PLATFORM_ID = -1;

const localMessages = {
  platformNew: { id: 'platform.create.confirm.platformNew', defaultMessage: '<b>Platform</b>: Create a new {type} platform ' },
  platformExisting: { id: 'platform.create.confirm.platformExisting', defaultMessage: '<b>Platform</b>: Add to existing' },
  name: { id: 'platform.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'platform.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  query: { id: 'platform.create.confirm.booleanQuery.keywords', defaultMessage: '<b>Query</b>: {query}' },
};

const TwitterSummary = (props) => {
  const { formValues } = props;
  let platformContent = null;
  switch (formValues.currentPlatformId) {
    case NEW_PLATFORM_ID: // that is, none
    case undefined:
      platformContent = <FormattedHTMLMessage {...localMessages.platformNew} values={{ type: formValues.currentPlatformType }} />;
      break;
    default:
      platformContent = <FormattedHTMLMessage {...localMessages.platformExisting} />;
  }
  return (
    <div className="focus-create-cofirm-boolean-query">
      <ul>
        <li><FormattedHTMLMessage {...localMessages.name} values={{ name: formValues.currentPlatform }} /></li>
        <li><FormattedHTMLMessage {...localMessages.description} values={{ description: formValues.query }} /></li>
        <li>{platformContent}</li>
        <li><FormattedHTMLMessage {...localMessages.query} values={{ query: formValues.query }} /></li>
      </ul>
    </div>
  );
};

TwitterSummary.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  formValues: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TwitterSummary);
