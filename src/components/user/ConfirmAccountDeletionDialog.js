import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import ConfirmationDialog from '../common/ConfirmationDialog';

const localMessages = {
  confirmText: { id: 'user.delete.confirm.ok', defaultMessage: 'Delete My Account' },
  title: { id: 'user.delete.confirm.title', defaultMessage: 'Deleting Your Account?' },
  intro: { id: 'user.delete.confirm.intro', defaultMessage: 'Deleting your account will permanently remove any information we have in our system associated with your account (email address, saved searches, etc).  Topics you may have created with not be deleted (because others may be using them). Confirm that you really want to do this by typing your email address below.' },
  prompt: { id: 'user.delete.confirm.prompt', defaultMessage: 'enter your email address to confirm' },
};

class ConfirmAccountDeletionDialog extends React.Component {
  state = {
    confirmationEmail: null,
  }

  render() {
    const { onDeleteAccount, onCancel, open } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <ConfirmationDialog
        title={localMessages.title}
        okText={localMessages.confirmText}
        onOk={() => onDeleteAccount(this.state.confirmationEmail)}
        onCancel={onCancel}
        open={open}
      >
        <p><FormattedMessage {...localMessages.intro} /></p>
        <TextField
          hinttext={formatMessage(localMessages.prompt)}
          fullWidth
          type="text"
          onChange={(e) => { this.setState({ confirmationEmail: e.target.value }); }}
        />
      </ConfirmationDialog>
    );
  }
}

ConfirmAccountDeletionDialog.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from parent
  open: PropTypes.bool.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default injectIntl(ConfirmAccountDeletionDialog);
