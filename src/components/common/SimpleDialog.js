import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AppButton from './AppButton';
import messages from '../../resources/messages';

class SimpleDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = (evt) => {
    evt.preventDefault();
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { trigger, children, title } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <span>
        <a href="#" role="button" tabIndex="0" onClick={this.handleClickOpen}>{trigger}</a>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
          <DialogContent>
            {children}
          </DialogContent>
          <DialogActions>
            <AppButton
              primary
              label={formatMessage(messages.ok)}
              onClick={this.handleClose}
            >
              <FormattedMessage {...messages.ok} />
            </AppButton>,
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

SimpleDialog.propTypes = {
  // from composition
  intl: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  trigger: PropTypes.string.isRequired,
};


export default injectIntl(SimpleDialog);
