import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { platformIconUrl, platformNameMessage, sourceNameMessage } from './AvailablePlatform';

const EnabledPlatformSummary = ({ platform }) => (
  <div className="platform-summary">
    <img src={platformIconUrl(platform.platform)} alt={platform.platform} />
    <FormattedHTMLMessage {...platformNameMessage(platform.platform, platform.source)} />
    (<FormattedHTMLMessage {...sourceNameMessage(platform.source)} />)
    <code>{platform.query}</code>
  </div>
);

EnabledPlatformSummary.propTypes = {
  // from parent
  platform: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EnabledPlatformSummary);
