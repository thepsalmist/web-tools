import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Alert from '@material-ui/lab/Alert';
import DataCard from '../../../common/DataCard';
import IngestCardActions from './IngestCardActions';
import messages from '../../../../resources/messages';

const MSG_NAMESPACE = 'source.feeds.sitemaps.ingest.pending';
const localMessages = {
  date: { id: `${MSG_NAMESPACE}.date`, defaultMessage: 'Processing started {date}' },
};


const IngestCardPending = ({ date, onCancel, intl }) => {
  const { formatMessage } = intl;
  const actions = <IngestCardActions onClickA={onCancel} labelA={formatMessage(messages.cancel)} />;
  return (
    <DataCard actions={actions}>
      <Alert severity="info"><FormattedMessage {...localMessages.date} values={{ date }} /></Alert>
    </DataCard>
  );
};

IngestCardPending.propTypes = {
    date: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

export default injectIntl(IngestCardPending);
