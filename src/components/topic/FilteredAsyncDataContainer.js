import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import withAsyncDataFetch from '../common/hocs/AsyncDataContainer';

/**
 * shouldasyncFetch: optional extra function to run to check if data should be re-fecthed; passed (props, nextProps)
 */
const withFilteredAsyncData = (ChildComponent, fetchAsyncData, shouldFetchData) => {
  class FilteredAsyncDataContainer extends React.Component {
    componentWillReceiveProps(nextProps) {
      const { filters, dispatch } = this.props;
      const filtersChanged = (nextProps.filters !== filters);
      const childSaysSomethingChanged = shouldFetchData && shouldFetchData(this.props, nextProps);
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
    withAsyncDataFetch(
      FilteredAsyncDataContainer,
      fetchAsyncData
    )
  );
};

// some helpful shouldFetchData handlers
export const shouldFetchOnSortChange = (props, nextProps) => (props.sort !== nextProps.sort);

export default withFilteredAsyncData;
