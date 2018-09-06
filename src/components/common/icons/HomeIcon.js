import PropTypes from 'prop-types';
import React from 'react';

const HomeIcon = props => (
  <div className="app-icon app-icon-home" style={{ backgroundColor: props.backgroundColor }}>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 11 11" xmlSpace="preserve">
      <path fill="#FFFFFF" d="M4.4,10.2V6.9h2.2v3.3h2.8V5.8H11l-5.5-5L0,5.8h1.7v4.4H4.4z" />
    </svg>
  </div>
);

HomeIcon.propTypes = {
  backgroundColor: PropTypes.string,
};

export default HomeIcon;
