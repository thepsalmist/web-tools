import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';
import PageTitle from '../common/PageTitle';

const SourcesApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <PageTitle />
      <AppContainer
        name="sources"
        title={formatMessage(messages.sourcesToolName)}
        description={formatMessage(messages.sourcesToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

SourcesApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SourcesApp);
