import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import messages from '../../../resources/messages';
import AppMenu from './AppMenu';
import { urlToTools } from '../../../lib/urlUtil';
import { getAppName } from '../../../config';
import { getUserRoles, hasPermissions, PERMISSION_ADMIN } from '../../../lib/auth';


const localMessages = {
  menuTitle: { id: 'tools.menu.title', defaultMessage: 'Tools' },
  home: { id: 'tools.menu.items.home', defaultMessage: 'Home' },
  userManagement: { id: 'tools.menu.items.listTopics', defaultMessage: 'Admin: User Management' },
};


const UserAdminAppMenu = (props) => {
  let menu;
  if (props.isLoggedIn && hasPermissions(getUserRoles(props.user), PERMISSION_ADMIN)) {
    menu = (
      <Menu>
        <MenuItem onClick={() => { props.handleItemClick('home', true); }}>
          <FormattedMessage {...localMessages.home} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('admin/users/list', true); }}>
          <FormattedMessage {...localMessages.userManagement} />
        </MenuItem>
      </Menu>
    );
  }
  return (
    <AppMenu
      color="primary"
      titleMsg={localMessages.menuTitle}
      showMenu={getAppName() === 'tools' && props.isLoggedIn}
      onTitleClick={() => { props.handleItemClick('', getAppName() === 'tools'); }}
      menuComponent={menu}
    />
  );
};

UserAdminAppMenu.propTypes = {
  // state
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  // from dispatch
  handleItemClick: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  handleItemClick: (path, isLocal) => {
    if (isLocal) {
      dispatch(push(path));
    } else {
      window.location.href = urlToTools(path);
    }
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    UserAdminAppMenu
  )
);
