import PropTypes from 'prop-types';
import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { filteredLocation } from '../../util/location';
import { FILTER_PARSING_DONE } from '../../../reducers/topics/selected/filters';

const withFilteredUrlMaintenance = (ChildComponent) => {
  class FilteredUrlMaintainer extends React.Component {
    componentDidUpdate(prevProps) {
      const { filters, location, dispatch } = this.props;
      const prevFilters = prevProps.filters;
      if (filters.parsingStatus === FILTER_PARSING_DONE) {
        const needToUpdateLocation = ((filters.snapshotId !== prevFilters.snapshotId)
          || (filters.focusId !== prevFilters.focusId)
          || (filters.timespanId !== prevFilters.timespanId)
          || (filters.q !== prevFilters.q));
        // console.log(needToUpdateLocation);
        // eslint-disable-next-line react/no-did-update-set-state
        if (needToUpdateLocation) {
          const newFilters = {
            snapshotId: filters.snapshotId,
            focusId: filters.focusId,
            timespanId: filters.timespanId,
            q: filters.q,
          };
          const newLocation = filteredLocation(location, newFilters);
          dispatch(push(newLocation));
        }
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  FilteredUrlMaintainer.propTypes = {
    filters: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  const mapStateToProps = state => ({
    filters: state.topics.selected.filters,
  });

  return connect(mapStateToProps)(
    FilteredUrlMaintainer
  );
};

export default withFilteredUrlMaintenance;
