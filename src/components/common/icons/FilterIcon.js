import React from 'react';

const FilterIcon = props => (
  <div className="app-icon app-icon-medium app-icon-filter" style={{ backgroundColor: props.backgroundColor }}>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="33.77px" height="28.394px" viewBox="0 0 33.77 28.394" enableBackground="new 0 0 33.77 28.394" xmlSpace="preserve">
      <path fill="#EEEEEE" d="M33.558,0.348c-0.198-0.225-0.517-0.344-0.92-0.344l-24.007,0c-2.497,0-4.993,0-7.493-0.003 c-0.2,0-0.805,0-1.056,0.602c-0.124,0.301-0.17,0.756,0.324,1.213c0.264,0.244,0.519,0.496,0.772,0.75l2.459,2.428 c3.025,2.988,6.05,5.976,9.08,8.959c0.14,0.137,0.19,0.262,0.189,0.475c-0.003,1.43-0.002,2.86-0.001,4.29 c0.001,2.786,0.002,5.666-0.019,8.498c-0.003,0.365,0.113,0.686,0.326,0.899c0.179,0.181,0.422,0.28,0.683,0.28 c0.22,0,0.442-0.066,0.664-0.197c1.932-1.143,3.976-2.287,5.617-3.207c0.491-0.275,0.71-0.654,0.707-1.23 c-0.01-1.873-0.01-3.748-0.011-5.621c0-1.25,0-2.5-0.003-3.749c0-0.188,0.043-0.296,0.164-0.411 c0.428-0.409,0.847-0.824,1.266-1.241l6.293-6.214c1.619-1.597,3.239-3.194,4.854-4.797c0.162-0.161,0.281-0.401,0.312-0.626 C33.798,0.801,33.728,0.542,33.558,0.348z M29.542,2.81c-2.092,2.059-4.183,4.12-6.273,6.182l-1.831,1.809 c-0.7,0.692-1.4,1.384-2.105,2.07c-0.296,0.288-0.433,0.621-0.433,1.049c0.003,1.414,0.004,2.826,0.005,4.24 c0,1.688,0.001,3.374,0.006,5.061c0.001,0.17-0.03,0.221-0.181,0.305c-0.942,0.525-1.88,1.061-2.816,1.596l-1.038,0.593v-3.629 c-0.002-2.692-0.004-5.383,0.007-8.075c0.001-0.491-0.151-0.861-0.493-1.199c-2.769-2.723-5.53-5.45-8.292-8.178L3.433,2.004h26.95 C30.087,2.285,29.812,2.544,29.542,2.81z" />
    </svg>
  </div>
);

FilterIcon.propTypes = {
  backgroundColor: React.PropTypes.string,
};

export default FilterIcon;