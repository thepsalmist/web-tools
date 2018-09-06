import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const SourcesApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <Helmet>
        <title>
          {`${formatMessage(messages.sourcesToolName)} | ${formatMessage(messages.suiteName)}`}
        </title>
      </Helmet>
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
