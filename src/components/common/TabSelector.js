import React from 'react';
import PropTypes from 'prop-types';
import { trimToMaxLength } from '../../lib/stringUtil';

const MAX_TAB_LABEL_LENGTH = 21;

class TabSelector extends React.Component {
  state = {
    selectedViewIndex: 0,
  }

  render() {
    const { onViewSelected, tabLabels } = this.props;
    if (tabLabels.length === 1) {
      // if only one query don't show option to switch between them
      return null;
    }
    return (
      <ul className="tab-selector">
        {tabLabels.filter(label => label !== undefined).map((label, idx) => (
          <li
            role="button"
            tabIndex={0}
            style={{ color: label.color }}
            onKeyPress={evt => evt.preventDefault()}
            key={idx}
            className={`${this.state.selectedViewIndex === idx ? 'selected' : ''}`}
            onClick={() => {
              this.setState({ selectedViewIndex: idx });
              onViewSelected(idx);
            }}
          >
            {trimToMaxLength(label.label || label, MAX_TAB_LABEL_LENGTH)}
          </li>
        ))}
      </ul>
    );
  }
}

TabSelector.propTypes = {
  // from parent
  tabLabels: PropTypes.array, // an array of strings
  onViewSelected: PropTypes.func, // will get passed the index of the tab selected
};

export default TabSelector;
