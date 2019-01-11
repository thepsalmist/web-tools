import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ColorPicker from '../../common/ColorPicker';
import { QUERY_LABEL_CHARACTER_LIMIT, ACTION_MENU_ITEM_CLASS, LEFT, RIGHT } from '../../../lib/explorerUtil';
import { defaultMenuOriginProps } from '../../util/uiUtil';
import { trimToMaxLength } from '../../../lib/stringUtil';

const localMessages = {
  rename: { id: 'explorer.querypicker.title', defaultMessage: 'Rename Query' },
  duplicate: { id: 'explorer.querypicker.title', defaultMessage: 'Duplicate Query' },
  delete: { id: 'explorer.querypicker.delete', defaultMessage: 'Delete Query' },
  moveLeft: { id: 'explorer.querypicker.move.left', defaultMessage: 'Move Left' },
  moveRight: { id: 'explorer.querypicker.move.right', defaultMessage: 'Move Right' },
};

class QueryPickerItemMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { query, isDeletable, onColorChange, onDuplicate, onDelete, onMove, onLabelEditRequest } = this.props;
    let nameInfo = <div />;
    // construct the menu to use for each
    const menuChildren = [
      <MenuItem key="edit" className={ACTION_MENU_ITEM_CLASS} onClick={() => { onLabelEditRequest(); this.handleClose(); }}>
        <FormattedMessage {...localMessages.rename} />
      </MenuItem>,
      <MenuItem key="duplicate" className={ACTION_MENU_ITEM_CLASS} onClick={() => { onDuplicate(); this.handleClose(); }}>
        <FormattedMessage {...localMessages.duplicate} />
      </MenuItem>,
      <MenuItem key="color" className="color-picker-menu-item">
        <ColorPicker
          name="color"
          color={query.color}
          onChange={(e) => { onColorChange(e.value); this.handleClose(); }}
          showLabel
        />
      </MenuItem>,
    ];
    if (isDeletable()) { // if this is not the only QueryPickerItem
      menuChildren.push(<Divider key="divider" />);
      menuChildren.push(<MenuItem key="delete" className={ACTION_MENU_ITEM_CLASS} onClick={() => { onDelete(query); this.handleClose(); }}><FormattedMessage {...localMessages.delete} /></MenuItem>);
      menuChildren.push(<Divider key="divider" />);
      if (query.sortPosition > 0) {
        menuChildren.push(<MenuItem key="moveLeft" className={ACTION_MENU_ITEM_CLASS} onClick={() => { onMove(LEFT); this.handleClose(); }}><FormattedMessage {...localMessages.moveLeft} /></MenuItem>);
      }
      menuChildren.push(<MenuItem key="moveRight" className={ACTION_MENU_ITEM_CLASS} onClick={() => { onMove(RIGHT); this.handleClose(); }}><FormattedMessage {...localMessages.moveRight} /></MenuItem>);
    }
    // build the menu
    if (query) {
      nameInfo = (
        <div>
          <ColorPicker
            color={query.color}
            onChange={(e) => { onColorChange(e.value); this.handleClose(); }}
          />&nbsp;
          <span
            className="query-picker-name"
          >
            {trimToMaxLength(query.label, QUERY_LABEL_CHARACTER_LIMIT)}
          </span>
          <div className="query-picker-icon-button">
            <IconButton onClick={this.handleClick} aria-haspopup="true" aria-owns="logged-in-header-menu"><MoreVertIcon /></IconButton>
            <Menu
              id="logged-in-header-menu"
              open={Boolean(this.state.anchorEl)}
              className="query-picker-icon-button"
              {...defaultMenuOriginProps}
              anchorEl={this.state.anchorEl}
              onBackdropClick={this.handleClose}
              onClose={this.handleClose}
            >
              {menuChildren}
            </Menu>
          </div>
        </div>
      );
    }
    return nameInfo;
  }
}

QueryPickerItemMenu.propTypes = {
  // from parent
  query: PropTypes.object,
  isDeletable: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onMove: PropTypes.func.isRequired,
  onLabelEditRequest: PropTypes.func,
  // from composition
  intl: PropTypes.object.isRequired,
};

export default injectIntl(QueryPickerItemMenu);
