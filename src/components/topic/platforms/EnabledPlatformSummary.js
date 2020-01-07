import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { platformIconUrl, platformNameMessage, sourceNameMessage } from './AvailablePlatform';
import PlatformDetailsInfo from './PlatformDetailsInfo';

const NEW_PLATFORM_ID = 'new'; // TODO undefined if a fetchAsncy

const EnabledPlatformSummary = ({ platform }) => {
  let platformHeading = null;
  let platformChannel = null;
  switch (platform.topic_seed_queries_id) { // TODO no seed queries if async
    case NEW_PLATFORM_ID:
    case undefined:
      platformHeading = <FormattedHTMLMessage {...sourceNameMessage} />;
      break;
    default:
      platformHeading = <FormattedHTMLMessage {...platformNameMessage(platform.platform, platform.source)} />;
      platformChannel = <PlatformDetailsInfo platform={platform} />;
      break;
  }

  return (
    <div className="platform-summary">
      <img src={platformIconUrl(platform.platform)} alt={platform.platform} />
      { platformHeading }
      { platformChannel }
    </div>
  );
};

EnabledPlatformSummary.propTypes = {
  // from parent
  platform: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EnabledPlatformSummary);
