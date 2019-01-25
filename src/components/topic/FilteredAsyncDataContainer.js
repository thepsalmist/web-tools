import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import withAsyncData from '../common/hocs/AsyncDataContainer';

/**
 * propsToRefetchOn: optional array of property names that should be watched; if any of them change then
 * a refetch will happen
 */
const withFilteredAsyncData = (fetchAsyncData, propsToRefetchOn) => {
  const withFilteredAsyncDataInner = (ChildComponent) => {
    const FilteredAsyncDataContainer = props => <ChildComponent {...props} />;

    FilteredAsyncDataContainer.propTypes = {
      // from store
      filters: PropTypes.shape({
        snapshotId: PropTypes.number,
        focusId: PropTypes.number,
        timespanId: PropTypes.number,
        q: PropTypes.string,
      }),
      // from compositional chain
      dispatch: PropTypes.func.isRequired,
    };

    const mapStateToProps = state => ({
      filters: state.topics.selected.filters,
    });

    let propsToListenTo = ['filters'];
    if (propsToRefetchOn) {
      propsToListenTo = ['filters', ...propsToRefetchOn];
    }

    return connect(mapStateToProps)(
      withAsyncData(fetchAsyncData, propsToListenTo)(
        FilteredAsyncDataContainer
      )
    );
  };

  return withFilteredAsyncDataInner;
};

export default withFilteredAsyncData;
