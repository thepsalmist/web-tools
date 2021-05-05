import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import Alert from '@material-ui/lab/Alert';
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import messages from '../../resources/messages';
import { PERMISSION_MEDIA_EDIT } from '../../lib/auth';
import Permissioned from '../common/Permissioned';
import withHelp from '../common/hocs/HelpfulContainer';

const localMessages = {
  lastNewStory: { id: 'source.feed.lastNewStory', defaultMessage: 'Last New Story' },
  lastDownloadAttempt: { id: 'source.feed.lastDownloadAttempt', defaultMessage: 'Last Attempt' },
  lastDownloadSuccess: { id: 'source.feed.lastDownloadSuccess', defaultMessage: 'Last Success' },
  helpTitle: { id: 'source.feed.help.title', defaultMessage: 'About Sources Feed' },
  helpText: { id: 'source.feed.help.text',
    defaultMessage: '<p>A Spider Feed is a source found via spidering. When a story is found via spidering, as opposed to RSS publishing, Media Cloud creates a system generated source.</p>',
  },
  emptyIngest: { id: 'source.feeds.table.empty', defaultMessage: 'No {feedStatus} Ingests' },
};

class SourceFeedTable extends React.Component {
  isSystemGenerated = (feed) => feed.name === 'Spider Feed' || feed.url.endsWith('#spidered');

  render() {
    const { feeds, helpButton, feedStatus } = this.props;

    if (!feeds || feeds.length === 0) {
      return (
        <>
          <Alert severity="info"><FormattedMessage {...localMessages.emptyIngest} values={{ feedStatus }} /></Alert>
        </>
      );
    }

    return (
      <div className="source-feed-table">
        <table width="100%">
          <tbody>
            <tr>
              <th><FormattedMessage {...messages.feedName} /></th>
              <th><FormattedMessage {...messages.feedUrl} /></th>
              <th><FormattedMessage {...localMessages.lastNewStory} /></th>
              <th><FormattedMessage {...localMessages.lastDownloadAttempt} /></th>
              <th><FormattedMessage {...localMessages.lastDownloadSuccess} /></th>
            </tr>
            {feeds.map((feed, idx) => (
              <tr key={feed.feeds_id} className={`${(idx % 2 === 0) ? 'even' : 'odd'} feed-${(feed.active) ? 'active' : 'disabled'}`}>
                <td>
                  {this.isSystemGenerated(feed) && <i>System Generated {' '}</i>}
                  {feed.name}
                  {this.isSystemGenerated(feed) && helpButton}
                  <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
                    { ' | ' }
                    <Link to={`/sources/${feed.media_id}/feeds/${feed.feeds_id}/edit`}>
                      edit
                    </Link>
                  </Permissioned>
                </td>
                <td>
                  <a href={feed.url}>{feed.url}</a>
                </td>
                <td>
                  {feed.lastNewStoryMoment && <FormattedDate value={feed.lastNewStoryMoment} />}
                </td>
                <td>
                  {feed.lastDownloadMoment && <FormattedDate value={feed.lastDownloadMoment} />}
                </td>
                <td>
                  {feed.lastSuccessfulDownloadMoment && <FormattedDate value={feed.lastSuccessfulDownloadMoment} />}
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
  helpButton: PropTypes.node.isRequired,
  feedStatus: PropTypes.string.isRequired,
};

export default injectIntl(
  withHelp(localMessages.helpTitle, localMessages.helpText)(
    SourceFeedTable
  )
);
