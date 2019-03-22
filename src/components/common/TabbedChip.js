import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

const TabbedChip = ({ message, warning, error }) => (
  <div className={`tabbed-chip ${warning ? 'warning' : ''} ${error ? 'error' : ''}`}>
    <strong className="left-tab"><FormattedMessage {...message} /></strong>
  </div>
);

TabbedChip.propTypes = {
  // from parent
  message: PropTypes.object.isRequired,
  warning: PropTypes.bool,
  error: PropTypes.bool,
  // from compositional chain
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  TabbedChip
);
