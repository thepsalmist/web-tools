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


const MSG_NAMESPACE = 'source.feeds.sitemaps.ingest.abandoned';
const localMessages = {
  reason: { id: `${MSG_NAMESPACE}.reason`, defaultMessage: 'Reason' },
  lastAttempt: { id: `${MSG_NAMESPACE}.lastAttempt`, defaultMessage: 'Last Attempt' },
};


const AbandonedIngestsTable = ({ rows }) => (
  <TableContainer component={Paper}>
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell><FormattedMessage {...localMessages.reason} /></TableCell>
          <TableCell align="right"><FormattedMessage {...localMessages.lastAttempt} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={`${i}-${row.status_details}`}>
            <TableCell>{row.status_details}</TableCell>
            <TableCell align="right">{row.last_attempted_download_time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

AbandonedIngestsTable.propTypes = {
  rows: PropTypes.array,
};

export default injectIntl(AbandonedIngestsTable);
