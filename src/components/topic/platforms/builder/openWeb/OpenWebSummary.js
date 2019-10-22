import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { NEW_PLATFORM_PLACEHOLDER_ID } from '../PlatformDescriptionForm';

const localMessages = {
  platformNew: { id: 'platform.create.confirm.platformNew', defaultMessage: '<b>Technique</b>: Create a new one named {name} ({description}' },
  platformExisting: { id: 'platform.create.confirm.platformExisting', defaultMessage: '<b>Technique</b>: Add to existing' },
  name: { id: 'platform.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'platform.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  keywords: { id: 'platform.create.confirm.booleanQuery.keywords', defaultMessage: '<b>Keywords</b>: {keywords}' },
};

const OpenWebSummary = (props) => {
  const { formValues } = props;
  let platformContent = null;
  switch (formValues.platformDefinitionId) {
    case NEW_FOCAL_SET_PLACEHOLDER_ID:
      platformContent = <FormattedHTMLMessage {...localMessages.platformNew} values={{ name: formValues.platformName, description: formValues.platformDescription }} />;
      break;
    default:
      platformContent = <FormattedHTMLMessage {...localMessages.platformExisting} />;
  }
  return (
    <div className="focus-create-cofirm-boolean-query">
      <ul>
        <li><FormattedHTMLMessage {...localMessages.name} values={{ name: formValues.focusName }} /></li>
        <li><FormattedHTMLMessage {...localMessages.description} values={{ description: formValues.focusDescription }} /></li>
        <li>{platformContent}</li>
        <li><FormattedHTMLMessage {...localMessages.keywords} values={{ keywords: formValues.keywords }} /></li>
      </ul>
    </div>
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
