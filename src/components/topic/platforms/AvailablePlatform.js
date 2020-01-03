import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'react-flexbox-grid/lib';
import Chip from '@material-ui/core/Chip';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import AppButton from '../../common/AppButton';
import message from '../../../resources/messages';
import { googleFavIconUrl } from '../../../lib/urlUtil';

const localMessages = {
  'reddit.pushshift.io-name': { id: 'rd.ps.name', defaultMessage: 'Reddit (via Pushshift.io)' },
  'reddit.pushshift.io-about': { id: 'rd.ps.about', defaultMessage: 'Discover links shared on the historical Reddit archive hosted by PushShift.io. Specify keywords and subreddits to focus on. Any submissions matching the keywords in the specified subreddits will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'twitter.pushshift.io-name': { id: 'tw.ps.name', defaultMessage: 'Twitter (via Pushshift.io)' },
  'twitter.pushshift.io-about': { id: 'tw.ps.about', defaultMessage: 'Discover links shared by validated Twitter accounts since mid 2019 in the archive hosted by PushShift.io. Specify keywords to focus on. Any tweets matching the keywords will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'twitter.crimson_hexagon-name': { id: 'tw.ch.name', defaultMessage: 'Twitter (via Crimson Hexagon)' },
  'twitter.crimson_hexagon-about': { id: 'tw.ch.about', defaultMessage: '(<b>Admin Only</b>) Discover links shared in tweets from a Crimson Hexagon Monitor you have already created. You need the id of that monitor. Any tweets matching the keywords will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'facebook.crowd_tangle-name': { id: 'fb.ct.name', defaultMessage: 'Facebook (via Crowd Tangle)' },
  'facebook.crowd_tangle-about': { id: 'fb.ct.about', defaultMessage: '(<b>Admin Only</b>) Discover links shared in Facebook posts via Crowd Tangle. Specify keywords to match. Any posts from large public groups matching the keywords will be checked for links. Any links found will be add into the topic, and queued up for spidering.' },
  'web.web_ui_shim-name': { id: 'web.shim.name', defaultMessage: 'Open Web (via Media Cloud)' },
  'web.web_ui_shim-about': { id: 'web.shim.about', defaultMessage: 'Find matching stories in the Media Cloud archive. Specify media sources or collections. Any news matching those keywords from those sourecs will be added into the topic, and queued up for spidering.' },
};

const platformName = (platform, source) => {
  const msg = localMessages[`${platform}.${source}-name`];
  if (msg) {
    return msg;
  }
  return { id: 'unknown', defaultMessage: 'Unknown :-(' };
};

const platformDescription = (platform, source) => {
  const msg = localMessages[`${platform}.${source}-about`];
  if (msg) {
    return msg;
  }
  return { id: 'unknown', defaultMessage: 'Unknown :-(' };
};

const platformIconUrl = (platform) => {
  if (platform === 'reddit') return googleFavIconUrl('https://reddit.com');
  if (platform === 'facebook') return googleFavIconUrl('https://facebook.com');
  if (platform === 'twitter') return googleFavIconUrl('https://twitter.com');
  if (platform === 'web') return googleFavIconUrl('https://mediacloud.org');
  return '';
};

const AvailablePlatform = ({ platform, onAdd, onEdit, onDelete }) => (
  <div className={`available-platform ${(platform.topic_seed_queries_id === -1) ? 'inactive' : 'active'}`}>
    <Row>
      <Col lg={4}>
        <h3>
          <img src={platformIconUrl(platform.platform)} alt={platform.platform} />
          <FormattedHTMLMessage {...platformName(platform.platform, platform.source)} />
        </h3>
        {(platform.topic_seed_queries_id !== -1) && <Chip label="enabled" color="primary" size="small" />}
        {(platform.topic_seed_queries_id === -1) && <Chip label="disabled" variant="outlined" size="small" />}
      </Col>
      <Col lg={6}>
        <FormattedHTMLMessage {...platformDescription(platform.platform, platform.source)} />
      </Col>
      <Col lg={2}>
        <div className="actions">
          {(platform.topic_seed_queries_id === -1) && <AppButton primary label={message.add} onClick={() => onAdd(platform)} />}
          {(platform.topic_seed_queries_id !== -1) && (
            <>
              <AppButton primary label={message.edit} onClick={() => onEdit(platform)} />
              <br />
              <AppButton secondary label={message.remove} onClick={() => onDelete(platform)} />
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
