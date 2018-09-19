import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

class FocusListItem extends React.Component {
  handleClick = (evt) => {
    evt.preventDefault();
    const { focus, onSelected } = this.props;
    onSelected(focus);
  }

  render() {
    const { focus, selected } = this.props;
    const selectedClass = (selected === true) ? 'selected' : '';
    const rootClasses = `popup-item focus-item ${selectedClass}`;
    const subtitle = ('focalSet' in focus) ? <small>{focus.focalSet.name}</small> : null;
    return (
      <div
        className={rootClasses}
        onClick={this.handleClick}
        id={`focus-${focus.foci_id}`}
        onKeyPress={this.handleClick}
        role="button"
        tabIndex={0}
      >
        <div className="title">{focus.name}</div>
        {subtitle}
      </div>
    );
  }
}

FocusListItem.propTypes = {
  intl: PropTypes.object.isRequired,
  focus: PropTypes.object.isRequired,
  onSelected: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default injectIntl(FocusListItem);
