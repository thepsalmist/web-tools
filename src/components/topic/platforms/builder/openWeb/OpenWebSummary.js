import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import PlatformDetailsInfo from '../../PlatformDetailsInfo';

const NEW_PLATFORM_ID = 'new';

const localMessages = {
  platformNew: { id: 'platform.create.confirm.platformNew', defaultMessage: '<b>Technique</b>: Create a new one named {name} ({description}' },
  platformExisting: { id: 'platform.create.confirm.platformExisting', defaultMessage: '<b>Technique</b>: Add to existing' },
  name: { id: 'platform.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'platform.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  query: { id: 'platform.create.confirm.booleanQuery.keywords', defaultMessage: '<b>Query</b>: {query}' },
};

const OpenWebSummary = (props) => {
  const { formValues } = props;
  let platformContent = null;
  switch (formValues.platform) {
    case NEW_PLATFORM_ID:
      platformContent = <FormattedHTMLMessage {...localMessages.platformNew} values={{ name: formValues.currentPlatform, description: formValues.currentPlatform }} />;
      break;
    default:
      platformContent = <FormattedHTMLMessage {...localMessages.platformExisting} />;
  }
  platformContent += <PlatformDetailsInfo platform={formValues} />;
  // TODO, show before/after platform?
  return (
    { platformContent }
  );
};

OpenWebSummary.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  formValues: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(OpenWebSummary);
