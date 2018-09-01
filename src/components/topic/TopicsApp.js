import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';

const TopicsApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <Helmet><title>{`${formatMessage(messages.topicsToolName)} | ${formatMessage(messages.suiteName)}`}</title></Helmet>
      <AppContainer
        name="topics"
        title={formatMessage(messages.topicsToolName)}
        description={formatMessage(messages.topicsToolDescription)}
      >
        {props.children}
      </AppContainer>
    </div>
  );
};

TopicsApp.propTypes = {
  children: PropTypes.node,
  intl: PropTypes.object.isRequired,
};

export default
  injectIntl(
    TopicsApp
  );
