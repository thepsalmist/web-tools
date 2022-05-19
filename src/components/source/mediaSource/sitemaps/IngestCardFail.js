import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import { Grid } from '@material-ui/core';
import DataCard from '../../../common/DataCard';
import IngestCardActions from './IngestCardActions';


const MSG_NAMESPACE = 'source.feeds.sitemaps.ingest.preview.failed';
const localMessages = {
  failedDate: { id: `${MSG_NAMESPACE}.failedDate`, defaultMessage: 'Failed on {date}' },
  abandoned: { id: `${MSG_NAMESPACE}.abandoned`, defaultMessage: 'Abandon' },
  retry: { id: `${MSG_NAMESPACE}.retry`, defaultMessage: 'Retry' },
};

const IngestCardFail = ({ errorDetails, date, onAbandon, onRetry, intl }) => {
  const { formatMessage } = intl;
  const actions = (
    <IngestCardActions
      onClickA={onAbandon}
      labelA={formatMessage(localMessages.abandoned)}
      onClickB={onRetry}
      labelB={formatMessage(localMessages.retry)}
    />
  );
  return (
    <DataCard actions={actions}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="error">
            <FormattedMessage {...localMessages.failedDate} values={{ date }} />
          </Alert>
        </Grid>
        <Grid item xs={12}>
          {errorDetails}
        </Grid>
      </Grid>
    </DataCard>
  );
};

IngestCardFail.propTypes = {
  date: PropTypes.string.isRequired,
  errorDetails: PropTypes.string.isRequired,
  onAbandon: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(IngestCardFail);
