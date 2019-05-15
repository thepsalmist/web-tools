import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import TopicPageTitle from '../TopicPageTitle';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Snapshot Builder' },
};

const SnapshotBuilder = props => (
  <div className="snapshot-builder">
    <TopicPageTitle value={localMessages.title} />
    {props.children}
  </div>
);

SnapshotBuilder.propTypes = {
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default
injectIntl(
  SnapshotBuilder
);
