import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import AvailablePlatform from './AvailablePlatform';

const AvailablePlatformList = ({ platforms, onEdit, onAdd, onDelete }) => (
  <div className="available-platform-list">
    {platforms.map(p => <AvailablePlatform key={`${p.platform}.${p.source}`} platform={p} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} />)}
  </div>
);

AvailablePlatformList.propTypes = {
  // from parent
  platforms: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  // from context
  intl: PropTypes.object.isRequired,
};

export default
injectIntl(
  AvailablePlatformList
);
