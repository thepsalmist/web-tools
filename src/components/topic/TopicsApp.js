import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import AppContainer from '../AppContainer';
import messages from '../../resources/messages';
import PageTitle from '../common/PageTitle';

const TopicsApp = (props) => {
  const { formatMessage } = props.intl;
  return (
    <div>
      <PageTitle />
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

export default injectIntl(TopicsApp);
