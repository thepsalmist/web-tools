import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import AppButton from './AppButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import messages from '../../resources/messages';

const localMessages = {
  title: { id: 'title', defaultMessage: 'Copy To All Queries' },
};

class CopyAllComponent extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    const { onOk } = this.props;
    this.setState({ open: false });
    onOk();
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  render() {
    const { label, title, msg } = this.props;
    const { formatMessage } = this.props.intl;
    const dialogActions = [
      <AppButton
        key={formatMessage(messages.cancel)}
        label={formatMessage(messages.cancel)}
        onClick={this.handleCancel}
      />,
      <AppButton
        key={formatMessage(messages.ok)}
        label={formatMessage(messages.ok)}
        primary
        onClick={this.handleClose}
      />,
    ];
    let content = null;
    if (msg) {
      content = (
        <div>
          {msg}
        </div>
      );
    }

    const dialogTitle = title ? formatMessage(localMessages.title) : '';
    return (
      <div className="copy-all">
        <label htmlFor="q">{label}</label>
        <a role="button" title={formatMessage(localMessages.title)} tabIndex="0" onTouchTap={this.handleOpen}>&nbsp;&#x00BB;</a>
        <Dialog
          className="app-dialog"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            {content}
          </DialogContent>
          <DialogActions>{dialogActions}</DialogActions>
        </Dialog>
      </div>
    );
  }
}

CopyAllComponent.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  // from parent
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default injectIntl(CopyAllComponent);
