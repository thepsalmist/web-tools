import PropTypes from 'prop-types';
import React from 'react';

const AddQueryIcon = () => (
  <div className="app-icon app-icon-medium app-icon-add">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="9.438px" height="9.438px" viewBox="0 0 9.438 9.438" enableBackground="new 0 0 9.438 9.438" xmlSpace="preserve">
      <path fill="#333333" d="M8.938,4.1h-3.6V0.5c0-0.275-0.277-0.5-0.619-0.5c-0.343,0-0.62,0.225-0.62,0.5v3.6H0.5 C0.223,4.1,0,4.377,0,4.719c0,0.343,0.223,0.62,0.5,0.62h3.599v3.599c0,0.277,0.277,0.5,0.62,0.501 c0.342-0.001,0.619-0.224,0.619-0.501V5.339h3.6c0.275,0,0.5-0.277,0.5-0.62C9.438,4.377,9.213,4.1,8.938,4.1z" />
    </svg>
  </div>
);

AddQueryIcon.propTypes = {
  backgroundColor: PropTypes.string,
};

export default AddQueryIcon;
