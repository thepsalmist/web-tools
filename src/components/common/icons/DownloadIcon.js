import PropTypes from 'prop-types';
import React from 'react';

const DownloadIcon = props => (
  <div className="app-icon app-icon-download" style={{ backgroundColor: props.backgroundColor }}>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" height="11px" viewBox="0 0 12.338 12.901" enableBackground="new 0 0 12.338 12.901" xmlSpace="preserve">
      <g>
        <g>
          <path fill="#FFFFFF" d="M11.709,12.901H0.629C0.281,12.901,0,12.617,0,12.268V8.641c0-0.35,0.281-0.633,0.629-0.633 c0.347,0,0.629,0.283,0.629,0.633v2.993h9.822V8.641c0-0.35,0.281-0.633,0.628-0.633s0.63,0.283,0.63,0.633v3.627 C12.338,12.617,12.055,12.901,11.709,12.901z" />
        </g>
        <g>
          <g>
            <path fill="#FFFFFF" d="M9.285,6.6L6.613,9.291c-0.071,0.07-0.159,0.126-0.258,0.156C6.334,9.453,6.314,9.459,6.293,9.463 C6.254,9.471,6.212,9.477,6.168,9.477c-0.105,0-0.205-0.025-0.291-0.074c-0.02-0.01-0.036-0.02-0.053-0.031 C5.807,9.36,5.789,9.348,5.771,9.334S5.738,9.307,5.725,9.291L3.053,6.6c-0.246-0.247-0.246-0.65,0-0.896 c0.246-0.248,0.645-0.248,0.891,0l1.596,1.609V0.635C5.539,0.283,5.822,0,6.168,0c0.348,0,0.629,0.283,0.629,0.635v6.678 l1.598-1.611c0.246-0.246,0.643-0.246,0.891,0C9.529,5.949,9.529,6.352,9.285,6.6z" />
          </g>
        </g>
      </g>
    </svg>
  </div>
);

DownloadIcon.propTypes = {
  backgroundColor: PropTypes.string,
};

export default DownloadIcon;
