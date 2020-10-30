import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import OpenWebMediaItem from '../../common/OpenWebMediaItem';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER, CRIMSON_HEXAGON_SOURCE, MEDIA_CLOUD_SOURCE } from '../../../lib/platformTypes';
import messages from '../../../resources/messages';

const localMessages = {
  crimsonHexagonId: { id: 'crimsonHexagonId', defaultMessage: 'Crimson Hexagon Id' },
};

const PlatformDetailsInfo = ({ platform, media_tags }) => {
  let content = null;
  let channelContent = null;

  // TODO: set the channels here...
  const channels = media_tags || (platform.channel || []);

  switch (platform.platform) {
    case PLATFORM_OPEN_WEB:
      content = (
        <>
          <FormattedMessage {...messages.topicQueryProp} />:
          &nbsp;
          <code>{typeof platform.query === 'object' ? platform.query.getValue() : platform.query}</code>
          <br />
        </>
      );
      if (platform.source === MEDIA_CLOUD_SOURCE) {
        channelContent = (
          <>
            <FormattedMessage {...messages.topicSourceCollectionsProp} />: &nbsp;
            {channels.map(m => <OpenWebMediaItem justText key={m.media_id || m.tags_id} object={m} />)}
          </>
        );
      }
      break;
    case PLATFORM_REDDIT:
      content = (
        <>
          <FormattedMessage {...messages.topicQueryProp} />:
          &nbsp;
          <code>{platform.query}</code>
          <br />
          <p>{channels}</p>
        </>
      );
      break;
    case PLATFORM_TWITTER:
      if (platform.source === CRIMSON_HEXAGON_SOURCE) {
        content = (
          <>
            <FormattedMessage {...localMessages.crimsonHexagonId} />:
            &nbsp;
            <code>{typeof platform.query === 'object' ? platform.query.getValue() : platform.query}</code>
          </>
        );
      } else {
        content = (
          <>
            <FormattedMessage {...messages.topicQueryProp} />:
            &nbsp;
            <code>{typeof platform.query === 'object' ? platform.query.getValue() : platform.query}</code>
          </>
        );
      }
      break;
    default:
      break;
  }
  return (
    <div className="platform-summary">
      {content}
      {channelContent}
    </div>
  );
};

PlatformDetailsInfo.propTypes = {
  // from parent
  platform: PropTypes.object.isRequired,
  media_tags: PropTypes.array,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(PlatformDetailsInfo);
