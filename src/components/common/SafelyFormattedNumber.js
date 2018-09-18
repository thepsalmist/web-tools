import PropTypes from 'prop-types';
import React from 'react';
import { FormattedNumber, FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  unknown: { id: 'unknown', defaultMessage: '?' },
};

const SafelyFormattedNumber = (props) => {
  if ((props.value === undefined) || (props.value === null)) {
    return <FormattedMessage {...localMessages.unknown} />;
  }
  return <FormattedNumber value={props.value} />;
};

SafelyFormattedNumber.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default
injectIntl(
  SafelyFormattedNumber
);
