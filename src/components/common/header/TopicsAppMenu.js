import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import messages from '../../../resources/messages';
import AppMenu from './AppMenu';
import { urlToTopicMapper } from '../../../lib/urlUtil';
import { getAppName } from '../../../config';
import { getUserRoles, hasPermissions, PERMISSION_MEDIA_EDIT } from '../../../lib/auth';


const localMessages = {
  menuTitle: { id: 'topics.menu.title', defaultMessage: 'Topic Mapper' },
  home: { id: 'topics.menu.items.home', defaultMessage: 'Home' },
  listTopics: { id: 'topics.menu.items.listTopics', defaultMessage: 'Admin: Topic Status Dashboard' },
};


const TopicsAppMenu = (props) => {
  let menuItems = [
    <MenuItem key="home" onClick={() => { props.handleItemClick('home', true); }}>
      <FormattedMessage {...localMessages.home} />
    </MenuItem>,
    <MenuItem key="search" onClick={() => { props.handleItemClick('topics/search', true); }}>
      <FormattedMessage {...messages.search} />
    </MenuItem>,
    <Divider key="div1" />,
    <MenuItem key="create" onClick={() => { props.handleItemClick('topics/create', true); }}>
      <FormattedMessage {...messages.createNewTopic} />
    </MenuItem>,
  ];
  if (props.isLoggedIn && hasPermissions(getUserRoles(props.user), PERMISSION_MEDIA_EDIT)) {
    menuItems = menuItems.concat([
      <Divider key="div2" />,
      <MenuItem key="status" onClick={() => { props.handleItemClick('topics/status', true); }}>
        <FormattedMessage {...localMessages.listTopics} />
      </MenuItem>,
    ]);
  }
  return (
    <AppMenu
      color="primary"
      titleMsg={localMessages.menuTitle}
      showMenu={getAppName() === 'topics' && props.isLoggedIn}
      onTitleClick={() => { props.handleItemClick('', getAppName() === 'topics'); }}
      menuComponent={(<Menu>{menuItems}</Menu>)}
    />
  );
};

TopicsAppMenu.propTypes = {
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
      window.location.href = urlToTopicMapper(path);
    }
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    TopicsAppMenu
  )
);
