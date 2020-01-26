import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import OpenWebMediaItem from '../../common/OpenWebMediaItem';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER, CRIMSON_HEXAGON_SOURCE } from '../../../lib/platformTypes';
import messages from '../../../resources/messages';

const PlatformDetailsInfo = ({ platform }) => {
  let queryContent = null;
  let channelContent = null;
  // TODO, some formatting perhaps of the query across platforms
  switch (platform.platform) {
    case PLATFORM_OPEN_WEB:
      channelContent = (
        <>
          <FormattedMessage {...messages.topicSourceCollectionsProp} />: &nbsp;
          {platform.media_tags && platform.media_tags.map(t => <OpenWebMediaItem justText key={t.tags_id} object={t} />)}
          {platform.media && platform.media.map(m => <OpenWebMediaItem justText key={m.media_id} object={m} />)}
        </>
      );
      queryContent = <code>{platform.query}</code>;
      break;
    case PLATFORM_REDDIT:
      queryContent = <code>{platform.query}</code>;
      channelContent = <p>platform.channel</p>; // subreddit info
      break;
    case PLATFORM_TWITTER:
      if (platform.source === CRIMSON_HEXAGON_SOURCE) {
        queryContent = <p>Crimson Hexagon Id:<code>{platform.query}</code></p>;
      } else {
        queryContent = <code>{platform.query}</code>;
      }
      break;
    default:
      break;
  }
  return (
    <div className="platform-summary">
      <FormattedMessage {...messages.topicQueryProp} /> :{queryContent}
      <br />
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
