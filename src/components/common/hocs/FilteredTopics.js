import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

function withFilters() {
  return (ChildComponent) => {
    const FilteredTopics = (props) => {
      const { handleRenderFilters, showFilters } = props;
      let content = null;
      if (showFilters && handleRenderFilters && typeof handleRenderFilters === 'function') {
        // render the filters
        content = <ChildComponent {...props} />;
      }
      return (
        <div>{ content }</div>
      );
    };

    FilteredTopics.propTypes = {
      intl: PropTypes.object.isRequired,
      // from child:
      handleRenderFilters: PropTypes.func,
      showFilters: PropTypes.bool,
    };

    return injectIntl(FilteredTopics);
  };
}

export default withFilters;
