import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib';
import Chip from '@material-ui/core/Chip';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import PlatformDetailsInfo from './PlatformDetailsInfo';
import AppButton from '../../common/AppButton';
import messages from '../../../resources/messages';
import { PLATFORM_OPEN_WEB, PLATFORM_REDDIT, PLATFORM_TWITTER, PLATFORM_FACEBOOK, GOOGLE_SOURCE, PLATFORM_GENERIC } from '../../../lib/platformTypes';
import { googleFavIconUrl } from '../../../lib/urlUtil';

const localMessages = {
  // platforms names
  'reddit.pushshift-name': { id: 'rd.ps.name', defaultMessage: 'Links Submitted to Reddit' },
  'twitter.pushshift-name': { id: 'tw.ps.name', defaultMessage: 'Links Shared in Verified Tweets' },
  'twitter.crimson_hexagon-name': { id: 'tw.ch.name', defaultMessage: 'Links Shared in Sampled Tweets' },
  'facebook.crowd_tangle-name': { id: 'fb.ct.name', defaultMessage: 'Links Posted in Large Public Facebook Groups' },
  'web.mediacloud-name': { id: 'web.shim.name', defaultMessage: 'News on the Open Web' },
  'web.google-name': { id: 'web.gogole.name', defaultMessage: 'News in Search Engine Results' },
  'generic_post.csv-name': { id: 'generic_post.csv.name', defaultMessage: 'Links in Uploaded Content' },
  // source names
  'crowd_tangle-name': { id: 'crowdTangle.name', defaultMessage: 'via Crowd Tangle' },
  'pushshift-name': { id: 'rd.ps.name', defaultMessage: 'via Pushshift.io' },
  'crimson_hexagon-name': { id: 'crimson_hexagon.name', defaultMessage: 'via Crimson Hexagon' },
  'mediacloud-name': { id: 'mediaCloud.name', defaultMessage: 'via Media Cloud' },
  'google-name': { id: 'mediaCloud.name', defaultMessage: 'via Google' },
  'csv-name': { id: 'mediaCloud.name', defaultMessage: 'via CSV upload' },
  // combos
  'reddit.pushshift-about': { id: 'rd.ps.about', defaultMessage: 'Discover links shared on the historical Reddit archive hosted by PushShift.io. Specify keywords and subreddits to focus on. Any submissions matching the keywords in the specified subreddits will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'twitter.pushshift-about': { id: 'tw.ps.about', defaultMessage: 'Discover links shared by validated Twitter accounts since mid 2019 in the archive hosted by PushShift.io. Specify keywords to focus on. Any tweets matching the keywords will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'twitter.crimson_hexagon-about': { id: 'tw.ch.about', defaultMessage: '(<b>Admin Only</b>) Discover links shared in tweets from a Crimson Hexagon Monitor you have already created. <b>You need to enter the id of that monitor.</b> Any tweets matching the keywords will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'facebook.crowd_tangle-about': { id: 'fb.ct.about', defaultMessage: '(<b>Admin Only</b>) Discover links shared in Facebook posts via Crowd Tangle. Specify keywords to match. Any posts from large public groups matching the keywords will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'web.mediacloud-about': { id: 'web.mediaCloud.about', defaultMessage: 'Find matching stories in the Media Cloud archive. Specify media sources or collections. Any news matching those keywords from those sources will be added into the topic, and queued up for spidering.' },
  'web.google-about': { id: 'web.google.about', defaultMessage: 'Find top matching news stories in Google search for your time period. Any news stories in the first few pages of Google search results on each day matching your keywords will be added into the topic, and queued up for spidering.' },
  'generic_post.csv-about': { id: 'generic_post.csv.about', defaultMessage: 'Find links shared in content you upload in a CSV file. This is helpful if you have some content you want to start with that you\'ve acquired outside out system.' },
};

const UNKNOWN_THING_MS = { id: 'unknown', defaultMessage: 'Unknown :-(' };

export const platformNameMessage = (platform, source) => (localMessages[`${platform}.${source}-name`] || UNKNOWN_THING_MS);
export const sourceNameMessage = source => (localMessages[`${source}-name`] || UNKNOWN_THING_MS);
export const platformDescriptionMessage = (platform, source) => (localMessages[`${platform}.${source}-about`] || UNKNOWN_THING_MS);

export const platformIconUrl = (platform, source) => {
  if (platform === PLATFORM_REDDIT) return googleFavIconUrl('https://reddit.com');
  if (platform === PLATFORM_FACEBOOK) return googleFavIconUrl('https://facebook.com');
  if (platform === PLATFORM_TWITTER) return googleFavIconUrl('https://twitter.com');
  if (platform === PLATFORM_GENERIC) return googleFavIconUrl('https://dictionary.com'); // just an icon i picked
  if ((platform === PLATFORM_OPEN_WEB) && (source === GOOGLE_SOURCE)) return googleFavIconUrl('https://google.com');
  return googleFavIconUrl('https://mediacloud.org.com');
};

const AvailablePlatform = ({ platform, onAdd, onEdit, onDelete }) => (
  <div className={`available-platform ${(platform.isEnabled) ? 'active' : 'inactive'}`}>
    <Row>
      <Col lg={4}>
        <h3>
          <img src={platformIconUrl(platform.platform, platform.source)} alt={platform.platform} />
          <FormattedHTMLMessage {...platformNameMessage(platform.platform, platform.source)} />
        </h3>
        <small><FormattedHTMLMessage {...sourceNameMessage(platform.source)} /></small>
        {(platform.isEnabled) && <Chip label="enabled" color="primary" size="small" />}
        {(!platform.isEnabled) && <Chip label="disabled" variant="outlined" size="small" />}
      </Col>
      <Col lg={6}>
        <FormattedHTMLMessage {...platformDescriptionMessage(platform.platform, platform.source)} />
        {(platform.isEnabled) && (
          <PlatformDetailsInfo platform={platform} />
        )}
      </Col>
      <Col lg={2}>
        <div className="actions">
          {(!platform.isEnabled) && <AppButton primary label={messages.add} onClick={() => onAdd(platform)} />}
          {(platform.isEnabled) && (
            <>
              <AppButton primary label={messages.edit} onClick={() => onEdit(platform)} />
              <br />
              <AppButton secondary label={messages.remove} onClick={() => onDelete(platform)} />
            </>
          )}
        </div>
      </Col>
    </Row>
  </div>
);


AvailablePlatform.propTypes = {
  // from parent
  platform: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  // form context
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AvailablePlatform);
