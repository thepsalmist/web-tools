import PropTypes from 'prop-types';
import React from 'react';

const DescriptiveButton = (props) => {
  const { imageUrl, label, svgIcon, description, onClick, className, id } = props;
  let visualContent = null;
  if (imageUrl) {
    visualContent = (<img src={imageUrl} alt={label} width={50} height={50} />);
  } else if (svgIcon) {
    visualContent = svgIcon;
  }
  return (
    <div
      id={id}
      className={`descriptive-button ${className || ''}`}
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={() => null}
    >
      <div className="image">
        {visualContent}
      </div>
      <b>{label}</b>
      <p>{description}</p>
    </div>
  );
};

DescriptiveButton.propTypes = {
  // from parent
  imageUrl: PropTypes.string,
  svgIcon: PropTypes.node,
  label: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default DescriptiveButton;
