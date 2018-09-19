import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import QuerySelector from './QuerySelector';

const QuerySelectorContainer = (props) => {
  const { query, onQuerySelected } = props;
  return (
    <QuerySelector
      query={query || ''}
      onQuerySelected={onQuerySelected}
    />
  );
};

QuerySelectorContainer.propTypes = {
  // from parent
  onQuerySelected: PropTypes.func.isRequired,
  // from composition
  intl: PropTypes.object.isRequired,
  // from state
  query: PropTypes.string,
};

const mapStateToProps = state => ({
  query: state.topics.selected.filters.q,
});

export default
connect(mapStateToProps)(
  injectIntl(
    QuerySelectorContainer
  )
);
