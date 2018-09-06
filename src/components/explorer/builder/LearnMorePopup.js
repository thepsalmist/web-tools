import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/MenuItem';

const localMessages = {
  title: { id: 'explorer.querymediapicker.title', defaultMessage: 'Selecting Media' },
  desc: { id: 'explorer.querymediapicker.desc', defaultMessage: 'Media Cloud allows you to search within collections or media sources, or within online news sources directly. You can select media sources or collections in a variety of ways:' },
  option1: { id: 'explorer.querymediapicker.option1', defaultMessage: 'Search within our geographic collections by country' },
  option2: { id: 'explorer.querymediapicker.option2', defaultMessage: 'Pick from our commonly-used list of featured collections' },
  option3: { id: 'explorer.querymediapicker.option3', defaultMessage: 'Pick from any sources or collections you have "starred"' },
  option4: { id: 'explorer.querymediapicker.option4', defaultMessage: 'Search all our individual media sources by name or URL' },
  instructions: { id: 'explorer.querymediapicker.instructions', defaultMessage: 'When you find a source or collection you want to add, click the + button to the right of the description. You can edit your selections (by clicking the X button to remove unwanted selections) in the lower left corner of the dialog window. Click the OK button to add your source selections to your query.' },
};

class QueryPickerLoggedInHeader extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="simple-dialog-title"><FormattedMessage {...localMessages.title} /></DialogTitle>
        <ul>
          <li><FormattedMessage {...localMessages.option1} /></li>
          <li><FormattedMessage {...localMessages.option2} /></li>
          <li><FormattedMessage {...localMessages.option3} /></li>
          <li><FormattedMessage {...localMessages.option4} /></li>
        </ul>
      </Dialog>
    );
  }
}

QueryPickerLoggedInHeader.propTypes = {
  // from parent
  query: PropTypes.object,
  isDeletable: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onLabelEditRequest: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};


export default
  injectIntl(
    QueryPickerLoggedInHeader
  );
