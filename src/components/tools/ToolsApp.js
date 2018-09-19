import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const ToolsApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <AppContainer
        name="tools"
        title={formatMessage(messages.toolsToolName)}
        description={formatMessage(messages.toolsToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

ToolsApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ToolsApp);
