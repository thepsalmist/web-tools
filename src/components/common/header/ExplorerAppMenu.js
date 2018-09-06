import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import AppMenu from './AppMenu';
import { urlToExplorer } from '../../../lib/urlUtil';
import { getAppName } from '../../../config';

const localMessages = {
  menuTitle: { id: 'explorer.menu.title', defaultMessage: 'Explorer' },
};

const ExplorerAppMenu = (props) => {
  let menu;
  return (
    <AppMenu
      titleMsg={localMessages.menuTitle}
      showMenu={false}
      onTitleClick={() => { props.handleItemClick('', getAppName() === 'explorer'); }}
      menuComponent={menu}
    />
  );
};

ExplorerAppMenu.propTypes = {
  // state
  isLoggedIn: PropTypes.bool.isRequired,
  // from dispatch
  handleItemClick: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  handleItemClick: (path, isLocal) => {
    if (isLocal) {
      dispatch(push(path));
    } else {
      window.location.href = urlToExplorer(path);
    }
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    ExplorerAppMenu
  )
);
