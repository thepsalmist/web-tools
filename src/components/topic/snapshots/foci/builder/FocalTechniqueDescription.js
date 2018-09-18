import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const localMessages = {
  comingSoon: { id: 'focus.technique.comingsoon', defaultMessage: 'Coming soon! ' },
};

const FocalTechniqueDescription = (props) => {
  const { selected, disabled, nameMsg, descriptionMsg, id, image, icon, onClick, comingSoon } = props;
  const { formatMessage } = props.intl;
  const disabledClass = (disabled === true) ? 'disabled' : '';
  const selectedClass = (selected === true) ? 'selected' : '';
  const rootClasses = `focal-technique-description ${disabledClass} ${selectedClass}`;
  const clickHandler = (disabled === true) ? null : onClick;
  const comingSoonContent = (comingSoon === true) ? <span style={{ color: '#FFD700' }}><FormattedMessage {...localMessages.comingSoon} /></span> : null;
  let visualContent = null;
  if (image) {
    visualContent = <img alt={formatMessage(nameMsg)} tabIndex={0} src={image} width={136} height={136} role="button" onKeyPress={clickHandler} onClick={clickHandler} />;
  } else if (icon) {
    visualContent = <div className="focal-technique-icon" tabIndex={0} role="button" onKeyPress={clickHandler} onClick={clickHandler}>{icon()}</div>;
  }
  return (
    <div id={id} className={rootClasses}>
      {visualContent}
      <p><b><FormattedMessage {...nameMsg} /></b></p>
      <p>
        {comingSoonContent}
        <FormattedMessage {...descriptionMsg} />
      </p>
    </div>
  );
};

FocalTechniqueDescription.propTypes = {
  // from parent
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  icon: PropTypes.func,
  nameMsg: PropTypes.object.isRequired,
  descriptionMsg: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  comingSoon: PropTypes.bool,
  onClick: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(FocalTechniqueDescription);
