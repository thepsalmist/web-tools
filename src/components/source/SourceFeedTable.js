import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import { EditButton } from '../common/IconButton';
import TabSelector from '../common/TabSelector';

const localMessages = {
  activeTabLabel: { id: 'source.feed.active', defaultMessage: 'Active ({num})' },
  inactiveTabLabel: { id: 'source.feed.inactive', defaultMessage: 'Disabled ({num})' },
};

class SourceFeedTable extends React.Component {
  state = {
    selectedViewIndex: 0,
  };

  render() {
    const { feeds } = this.props;
    const { formatMessage } = this.props.intl;
    const content = null;

    if (feeds === undefined) {
      return (
        <div>
          { content }
        </div>
      );
    }

    const activeFeeds = feeds.filter(feed => feed.active);
    const inactiveFeeds = feeds.filter(feed => !feed.active);

    let tabFeeds;
    switch (this.state.selectedViewIndex) {
      case 0:
        tabFeeds = activeFeeds;
        break;
      case 1:
        tabFeeds = inactiveFeeds;
        break;
      default:
        break;
    }

    return (
      <div className="source-feed-table">
        <TabSelector
          tabLabels={[
            formatMessage(localMessages.activeTabLabel, { num: activeFeeds.length }),
            formatMessage(localMessages.inactiveTabLabel, { num: inactiveFeeds.length }),
          ]}
          onViewSelected={index => this.setState({ selectedViewIndex: index })}
        />
        <table width="100%">
          <tbody>
            <tr>
              <th><FormattedMessage {...messages.feedName} /></th>
              <th><FormattedMessage {...messages.feedType} /></th>
              <th><FormattedMessage {...messages.feedIsActive} /></th>
              <th><FormattedMessage {...messages.feedUrl} /></th>
            </tr>
            {tabFeeds.map((feed, idx) => (
              <tr key={feed.feeds_id} className={`${(idx % 2 === 0) ? 'even' : 'odd'} feed-${(feed.active) ? 'active' : 'disabled'}`}>
                <td>
                  {feed.name}
                </td>
                <td>
                  {feed.type}
                </td>
                <td>
                  {feed.active ? 'active' : 'disabled'}
                </td>
                <td>
                  <a href={feed.url}>{feed.url}</a>
                </td>
                <td>
                  <Link to={`/sources/${feed.media_id}/feeds/${feed.feeds_id}/edit`}>
                    <EditButton />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

SourceFeedTable.propTypes = {
  feeds: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SourceFeedTable);
