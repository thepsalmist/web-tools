import React from 'react';
import { injectIntl } from 'react-intl';
import AppContainer from '../AppContainer';
import TopicsDrawer from './TopicsDrawer';
import messages from '../../resources/messages';

const TopicsApp = (props) => {
  const { formatMessage } = props.intl;
  const drawer = <TopicsDrawer />;
  return (
    <div>
      <AppContainer
        name="topics"
        title={formatMessage(messages.topicsToolName)}
        description={formatMessage(messages.topicsToolDescription)}
        drawer={drawer}
        showLoginButton={false}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

TopicsApp.propTypes = {
  children: React.PropTypes.node,
  intl: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicsApp
  );