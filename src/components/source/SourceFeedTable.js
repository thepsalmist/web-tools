import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import Alert from '@material-ui/lab/Alert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
        <Alert severity="info"><FormattedMessage {...localMessages.emptyIngest} values={{ feedStatus }} /></Alert>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><FormattedMessage {...messages.feedName} /></TableCell>
              <TableCell><FormattedMessage {...messages.feedUrl} /></TableCell>
              <TableCell align="right"><FormattedMessage {...localMessages.lastNewStory} /></TableCell>
              <TableCell align="right"><FormattedMessage {...localMessages.lastDownloadAttempt} /></TableCell>
              <TableCell align="right"><FormattedMessage {...localMessages.lastDownloadSuccess} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeds.map((feed) => (
              <TableRow key={feed.feeds_id} className={`feed-${(feed.active) ? 'active' : 'disabled'}`}>
                <TableCell>
                  {this.isSystemGenerated(feed) && <i>System Generated {' '}</i>}
                  {feed.name}
                  {this.isSystemGenerated(feed) && helpButton}
                  <Permissioned onlyRole={PERMISSION_MEDIA_EDIT}>
                    { ' | ' }
                    <Link to={`/sources/${feed.media_id}/feeds/${feed.feeds_id}/edit`}>
                      edit
                    </Link>
                  </Permissioned>
                </TableCell>
                <TableCell>
                  <a href={feed.url}>{feed.url}</a>
                </TableCell>
                <TableCell align="right">
                  {feed.lastNewStoryMoment && <FormattedDate value={feed.lastNewStoryMoment} />}
                </TableCell>
                <TableCell align="right">
                  {feed.lastDownloadMoment && <FormattedDate value={feed.lastDownloadMoment} />}
                </TableCell>
                <TableCell align="right">
                  {feed.lastSuccessfulDownloadMoment && <FormattedDate value={feed.lastSuccessfulDownloadMoment} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
