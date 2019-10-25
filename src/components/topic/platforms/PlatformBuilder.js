import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TopicPageTitle from '../TopicPageTitle';

const localMessages = {
  title: { id: 'platform.builder.title', defaultMessage: 'Platform Builder' },
};

const PlatformBuilder = props => (
  <div className="platform-builder">
    <TopicPageTitle value={localMessages.title} />
    {props.children}
  </div>
);

PlatformBuilder.propTypes = {
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default
injectIntl(
  PlatformBuilder
);
