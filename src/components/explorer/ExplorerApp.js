import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';
import PageTitle from '../common/PageTitle';

const ExplorerApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <PageTitle />
      <AppContainer
        name="explorer"
        title={formatMessage(messages.explorerToolName)}
        description={formatMessage(messages.explorerToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

ExplorerApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ExplorerApp);
