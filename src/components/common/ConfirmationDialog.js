import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppButton from './AppButton';

class ConfirmationDialog extends React.Component {
  handleOk = () => {
    const { onOk } = this.props;
    onOk();
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  render() {
    const { open, title, children, okText } = this.props;
    const actions = [
      <AppButton
        key={1}
        label="Cancel"
        onTouchTap={this.handleCancel}
      />,
      <AppButton
        key={2}
        label={okText}
        primary
        onTouchTap={this.handleOk}
      />,
    ];
    return (
      <div>
        <Dialog
          modal={false}
          className="app-dialog"
          open={open}
          onClose={this.handleCancel}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {children}
          </DialogContent>
          <DialogActions>{actions}</DialogActions>
        </Dialog>
      </div>
    );
  }
}

ConfirmationDialog.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  // from parent
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  okText: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default injectIntl(ConfirmationDialog);
