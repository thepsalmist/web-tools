import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const ToolDescription = (props) => {
  const { name, description, screenshotUrl, url, className } = props;
  const { formatMessage } = props.intl;
  return (
    <div className={`tool-description ${className}`} onTouchTap={() => { window.location = url; }}>
      <h2><FormattedMessage {...name} /></h2>
      <p><FormattedMessage {...description} /></p>
      <img src={screenshotUrl} alt={formatMessage(name)} width="100%" />
    </div>
  );
};

ToolDescription.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  name: PropTypes.object.isRequired, // a msg to intl
  description: PropTypes.object.isRequired, // a msg to intl
  screenshotUrl: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default injectIntl(ToolDescription);
