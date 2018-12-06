import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppMenu from './AppMenu';
import { urlToTools } from '../../../lib/urlUtil';
import { getAppName } from '../../../config';

const localMessages = {
  menuTitle: { id: 'tools.menu.title', defaultMessage: 'Admin' },
  home: { id: 'tools.menu.items.home', defaultMessage: 'Home' },
  userManagement: { id: 'tools.menu.items.listTopics', defaultMessage: 'Admin: User Management' },
  storyView: { id: 'tools.menu.items.stories', defaultMessage: 'View Stories' },
};

const UserAdminAppMenu = props => (
  <AppMenu
    color="primary"
    titleMsg={localMessages.menuTitle}
    showMenu={getAppName() === 'tools' && props.isLoggedIn}
    onTitleClick={() => { props.handleItemClick('', getAppName() === 'tools'); }}
    menuComponent={(
      <Menu>
        <MenuItem onClick={() => { props.handleItemClick('admin/users/list', true); }}>
          <FormattedMessage {...localMessages.userManagement} />
        </MenuItem>
        <MenuItem onClick={() => { props.handleItemClick('admin/story/details', true); }}>
          <FormattedMessage {...localMessages.storyView} />
        </MenuItem>
      </Menu>
    )}
  />
);

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
