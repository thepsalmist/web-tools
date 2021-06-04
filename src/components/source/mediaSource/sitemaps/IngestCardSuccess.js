import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import { Grid } from '@material-ui/core';
import AppButton from '../../../common/AppButton';
import DataCard from '../../../common/DataCard';
import IngestCardActions from './IngestCardActions';


const MSG_NAMESPACE = 'source.feeds.sitemaps.card.success';
const localMessages = {
  reject: { id: `${MSG_NAMESPACE}.reject`, defaultMessage: 'Reject' },
  approve: { id: `${MSG_NAMESPACE}.approve`, defaultMessage: 'Approve' },
  download: { id: `${MSG_NAMESPACE}.download`, defaultMessage: 'Download stories for review (CSV)' },
  lastNew: { id: `${MSG_NAMESPACE}.lastNew`, defaultMessage: 'Last new story found {lastFoundDate}' },
};

const IngestCardSuccess = ({ date, lastFoundDate, onReject, onApprove, onDownload, intl }) => {
  const { formatMessage } = intl;
  const actions = (
    <IngestCardActions
      onClickA={onReject}
      labelA={formatMessage(localMessages.reject)}
      onClickB={onApprove}
      labelB={formatMessage(localMessages.approve)}
    />
  );
  return (
    <DataCard actions={actions}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="success">{`Succeeded on ${date}`}</Alert>
        </Grid>
        <Grid item xs={12}>
          <AppButton variant="contained" size="large" onClick={onDownload} fullWidth>
            <FormattedMessage {...localMessages.download} />
          </AppButton>
        </Grid>
        <Grid item xs={12}>
          <FormattedMessage {...localMessages.lastNew} values={{ lastFoundDate }} />
        </Grid>
      </Grid>
    </DataCard>
  );
};

IngestCardSuccess.propTypes = {
  date: PropTypes.string.isRequired,
  lastFoundDate: PropTypes.string.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(IngestCardSuccess);
