import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import { intlIfObject } from '../../lib/stringUtil';
import { getAppName } from '../../config';

const nameForApp = () => {
  const app = getAppName();
  if (app === 'tools') {
    return messages.toolsToolName;
  }
  if (app === 'explorer') {
    return messages.explorerToolName;
  }
  if (app === 'topics') {
    return messages.topicsToolName;
  }
  if (app === 'sources') {
    return messages.sourcesToolName;
  }
  const error = `Unknown app name: ${app}`;
  throw error;
};

const TITLE_SEPARATOR = ' | ';

const PageTitle = (props) => {
  const { formatMessage } = props.intl;
  let passedInTitle = '';
  if (props.value) {
    if (props.value instanceof Array) {
      passedInTitle = props.value.map(item => intlIfObject(formatMessage, item)).join(TITLE_SEPARATOR);
    } else {
      passedInTitle = intlIfObject(formatMessage, props.value);
    }
    passedInTitle += TITLE_SEPARATOR;
  }
  const titleString = `${passedInTitle}${formatMessage(nameForApp())}${TITLE_SEPARATOR}${formatMessage(messages.suiteName)}`;
  return (
    <Helmet>
      <title>
        {titleString}
      </title>
    </Helmet>
  );
};

const intlMessageShape = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired,
};

PageTitle.propTypes = {
  // from parent
  value: PropTypes.oneOfType([
    PropTypes.string, // pass in a formatted string to use as the page title
    PropTypes.arrayOf(PropTypes.string), // or an array of strings
    PropTypes.shape(intlMessageShape), // or pass in a message to be formatted
    PropTypes.arrayOf(PropTypes.shape(intlMessageShape)), // or an array of messages to be formatted
  ]),
  // from compositional chain
  intl: PropTypes.object,
};

export default
injectIntl(
  PageTitle
);
