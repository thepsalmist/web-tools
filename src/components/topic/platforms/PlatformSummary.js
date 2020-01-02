import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

const localMessages = {
  name: { id: 'platform.create.confirm.name', defaultMessage: '<b>Name</b>: {name}' },
  description: { id: 'platform.create.confirm.description', defaultMessage: '<b>Description</b>: {description}' },
  query: { id: 'platform.create.confirm.booleanQuery.keywords', defaultMessage: '<b>Query</b>: {query}' },
};

const PlatformSummary = (props) => (
  <div className="summary">
    {props.platforms.map((p) => (
      <ul>
        <li><FormattedHTMLMessage {...localMessages.name} values={{ name: p.currentPlatform }} /></li>
        <li><FormattedHTMLMessage {...localMessages.description} values={{ description: p.query }} /></li>
        <li><FormattedHTMLMessage {...localMessages.query} values={{ query: p.query }} /></li>
      </ul>
    ))};
  </div>
);


PlatformSummary.propTypes = {
  // from parent
  version: PropTypes.number.isRequired,
  platforms: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(PlatformSummary);
