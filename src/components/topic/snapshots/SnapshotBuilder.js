import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';

const localMessages = {
  title: { id: 'snapshot.builder.title', defaultMessage: 'Snapshot Builder' },
};

const SnapshotBuilder = props => (
  <div className="snapshot-builder">
    <Helmet><title>{props.intl.formatMessage(localMessages.title)}</title></Helmet>
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
