import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { injectIntl } from 'react-intl';
import messages from '../../../resources/messages';
import UserMenuContainer from './UserMenuContainer';
import SourcesAppMenu from './SourcesAppMenu';
import TopicsAppMenu from './TopicsAppMenu';
import ExplorerAppMenu from './ExplorerAppMenu';
import AdminAppMenu from './AdminAppMenu';
import { assetUrl } from '../../../lib/assetUtil';
import RecentNewsMenuContainer from '../news/RecentNewsMenuContainer';
import AppButton from '../AppButton';
import Permissioned from '../Permissioned';
import { PERMISSION_ADMIN } from '../../../lib/auth';
import { getAppName, APP_TOOLS } from '../../../config';

const BLOG_URL = 'https://mediacloud.org/blog/';
const SUPPORT_URL = 'https://mediacloud.org/support/';

const localMessages = {
  goHome: { id: 'nav.home', defaultMessage: 'Home' },
  admin: { id: 'nav.admin', defaultMessage: 'Admin' },
  support: { id: 'nav.support', defaultMessage: 'Support' },
  about: { id: 'nav.about', defaultMessage: 'About' },
};

const goToHome = (evt) => {
  evt.preventDefault();
  window.location.href = '/#/home';
};

const NavToolbar = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div id="nav-toolbar">
      <Grid>
        <Row>
          <Col lg={6}>
            <a href={`#${formatMessage(localMessages.goHome)}`} onClick={evt => goToHome(evt)}>
              <img
                className="app-logo"
                alt={formatMessage(messages.suiteName)}
                src={assetUrl('/static/img/mediacloud-logo-white-2x.png')}
                width={40}
                height={40}
              />
            </a>
            <ul>
              <li className="explorer">
                <ExplorerAppMenu />
              </li>
              <li className="topics">
                <TopicsAppMenu />
              </li>
              <li className="sources">
                <SourcesAppMenu />
              </li>
            </ul>
          </Col>
          <Col lg={6}>
            <ul className="right">
              <Permissioned onlyRole={PERMISSION_ADMIN}>
                <li className="admin">
                  <AdminAppMenu />
                </li>
              </Permissioned>
              <li className="support">
                <AppButton
                  variant="text"
                  href={SUPPORT_URL}
                  target="new"
                  label={formatMessage(localMessages.support)}
                />
              </li>
              <li className="blog">
                <AppButton
                  variant="text"
                  href={BLOG_URL}
                  target="new"
                  title={formatMessage(messages.blogToolDescription)}
                  label={formatMessage(messages.blogToolName)}
                />
              </li>
              { (getAppName() !== APP_TOOLS) && (
                <li className="about">
                  <AppButton
                    variant="text"
                    href="#/about"
                    label={formatMessage(messages.menuAbout)}
                  />
                </li>
              )}
              <li className="recent-changes-item">
                <RecentNewsMenuContainer />
              </li>
              <li className="user-menu-item">
                <UserMenuContainer />
              </li>
            </ul>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

NavToolbar.propTypes = {
  // from composition chain
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  NavToolbar
);
