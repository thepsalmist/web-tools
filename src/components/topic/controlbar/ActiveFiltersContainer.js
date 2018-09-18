import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ActiveFilters from './ActiveFilters';

/**
 */
const ActiveFiltersContainer = (props) => {
  const { selectedFocus, onRemoveFocus, onRemoveQuery, query } = props;
  return (
    <ActiveFilters
      query={query}
      focus={selectedFocus}
      onRemoveFocus={onRemoveFocus}
      onRemoveQuery={onRemoveQuery}
    />
  );
};

ActiveFiltersContainer.propTypes = {
  // from parent
  onRemoveFocus: PropTypes.func.isRequired,
  onRemoveQuery: PropTypes.func.isRequired,
  // from state
  selectedFocus: PropTypes.object,
  query: PropTypes.string,
};

const mapStateToProps = state => ({
  selectedFocus: state.topics.selected.focalSets.foci.selected,
  query: state.topics.selected.filters.q,
});

export default
injectIntl(
  connect(mapStateToProps)(
    ActiveFiltersContainer
  )
);
