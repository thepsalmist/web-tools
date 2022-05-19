import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const MSG_NAMESPACE = 'source.feeds.sitemaps.ingest.success';
const localMessages = {
  lastNew: { id: `${MSG_NAMESPACE}.lastNew`, defaultMessage: 'Last New Story' },
  lastAttempt: { id: `${MSG_NAMESPACE}.lastAttempt`, defaultMessage: 'Last Attempt' },
  lastSuccess: { id: `${MSG_NAMESPACE}.lastSuccess`, defaultMessage: 'Last Success' },
};


const SuccessfulIngestsTable = ({ rows }) => (
  <TableContainer component={Paper}>
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell><FormattedMessage {...localMessages.lastNew} /></TableCell>
          <TableCell align="right"><FormattedMessage {...localMessages.lastAttempt} /></TableCell>
          <TableCell align="right"><FormattedMessage {...localMessages.lastSuccess} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={`successful-ingest-${row.last_new_story}-${idx}`}>
            <TableCell>{row.last_new_story_time}</TableCell>
            <TableCell align="right">{row.last_attempted_download_time}</TableCell>
            <TableCell align="right">{row.last_successful_download_time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

SuccessfulIngestsTable.propTypes = {
  rows: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SuccessfulIngestsTable);
