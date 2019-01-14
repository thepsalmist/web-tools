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
    class FilteredAsyncDataContainer extends React.Component {
      componentWillReceiveProps(nextProps) {
        const { filters, dispatch } = this.props;
        const filtersChanged = (nextProps.filters !== filters);
        let childSaysSomethingChanged = false;
        if (propsToRefetchOn) {
          const haveChanged = propsToRefetchOn.map(propName => nextProps[propName] !== this.props[propName]);
          childSaysSomethingChanged = haveChanged.reduce((combined, current) => combined || current);
        }
        if (filtersChanged || childSaysSomethingChanged) {
          fetchAsyncData(dispatch, nextProps);
        }
      }

      render() {
        const { filters } = this.props;
        return <ChildComponent {...this.props} filters={filters} />;
      }
    }

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

    return connect(mapStateToProps)(
      withAsyncData(fetchAsyncData)(
        FilteredAsyncDataContainer
      )
    );
  };

  return withFilteredAsyncDataInner;
};

export default withFilteredAsyncData;
