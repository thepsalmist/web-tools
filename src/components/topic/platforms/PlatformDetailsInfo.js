import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import OpenWebMediaItem from '../../common/OpenWebMediaItem';

const PlatformDetailsInfo = ({ platform }) => {
  let channelContent = null;
  // TODO, some formatting perhaps of the query across platforms
  switch (platform.platform) {
    case 'web':
      if (platform.media !== null && platform.media.length) {
        channelContent = platform.media.map((m, idx) => <OpenWebMediaItem key={idx} object={m} />);
      }
      break;
    case 'reddit':
      channelContent = <p>platform.channel</p>; // subreddit info
      break;
    case 'twitter':
    default:
      break;
  }
  return (
    <div className="platform-summary">
      <code>{platform.query}</code>
      {channelContent}
    </div>
  );
};

PlatformDetailsInfo.propTypes = {
  // from parent
  platform: PropTypes.object.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(PlatformDetailsInfo);
