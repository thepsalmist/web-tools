import PropTypes from 'prop-types';
import React from 'react';

const AdminWrapper = props => (
  <div className="admin-wrapper">
    {props.children}
  </div>
);

AdminWrapper.propTypes = {
  // from parent
  children: PropTypes.node,
};

export default AdminWrapper;
