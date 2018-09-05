import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const ExplorerApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <Helmet>
        <title>
          {`${formatMessage(messages.explorerToolName)} | ${formatMessage(messages.suiteName)}`}
        </title>
      </Helmet>
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

export default
  injectIntl(
    ExplorerApp
  );
