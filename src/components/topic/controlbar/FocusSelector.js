import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

export const REMOVE_FOCUS = 0;

const localMessages = {
  pickFocus: { id: 'topic.focusFilter.pick', defaultMessage: 'Subtopic' },
  removeFocus: { id: 'topic.focusFilter.pick', defaultMessage: 'Don\'t use any Subtopic' },
};

class FocusSelector extends React.Component {
  handleFocusChange = (evt) => {
    const { foci, onFocusSelected } = this.props;
    const { formatMessage } = this.props.intl;
    let selected;
    if (evt.target.value === REMOVE_FOCUS) {
      selected = { foci_id: REMOVE_FOCUS, name: formatMessage(localMessages.removeFocus) };
    } else {
      selected = foci.find(focus => (focus.foci_id === evt.target.value));
    }
    onFocusSelected(selected);
  }

  render() {
    const { foci, selectedId } = this.props;
    const { formatMessage } = this.props.intl;
    const focusName = focus => `${focus.focalSet.name}: ${focus.name}`;
    foci.sort((f1, f2) => { // alphabetical
      const f1Name = focusName(f1).toUpperCase();
      const f2Name = focusName(f2).toUpperCase();
      if (f1Name < f2Name) return -1;
      if (f1Name > f2Name) return 1;
      return 0;
    });
    let detailsContent;
    /*
    if ((selectedId) && (selectedId !== REMOVE_FOCUS)) {
      detailsContent = (
        <div className="selected-focus-details">
          details
        </div>
      );
    }
    */
    // default to none
    return (
      <div className="focus-selector-wrapper">
        <InputLabel><FormattedMessage {...localMessages.pickFocus} /></InputLabel>
        <Select
          label={formatMessage(localMessages.pickFocus)}
          className="focus-selector"
          value={selectedId || ''}
          fullWidth
          displayEmpty
          onChange={this.handleFocusChange}
        >
          {foci.map(focus => (
            <MenuItem
              key={focus.foci_id}
              value={focus.foci_id}
            >
              <ListItemText><Typography classes={{ root: 'selected-focus-details' }}>{focusName(focus)}</Typography></ListItemText>
            </MenuItem>
          ))}
          <MenuItem
            value={REMOVE_FOCUS}
          >
            <ListItemText>{formatMessage(localMessages.removeFocus)}</ListItemText>
          </MenuItem>
        </Select>
        {detailsContent}
      </div>
    );
  }
}

FocusSelector.propTypes = {
  foci: PropTypes.array.isRequired,
  selectedId: PropTypes.number,
  intl: PropTypes.object.isRequired,
  onFocusSelected: PropTypes.func,
};

export default
injectIntl(
  FocusSelector
);
