import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withAsyncData from '../../hocs/AsyncDataContainer';
import { fetchTopAnalyticsResults } from '../../../../actions/systemActions';
import AnalyticsResultsTable from './AnalyticsResultsTable';

const AnalyticsResultsContainer = (props) => {
  const { type, action, topItems } = props;
  let content;
  if (type && action) {
    content = <AnalyticsResultsTable results={topItems} type={type} />;
  }
  return content;
};

AnalyticsResultsContainer.propTypes = {
  // from state
  fetchStatus: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  // from parent
  type: PropTypes.string,
  action: PropTypes.action,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.analytics.top.fetchStatus,
  topItems: state.system.analytics.top.list,
});

const fetchAsyncData = (dispatch, { type, action }) => {
  if (type && action) {
    dispatch(fetchTopAnalyticsResults({ type, action }));
  }
};

export default
connect(mapStateToProps)(
  withAsyncData(fetchAsyncData, ['type', 'action'])(
    AnalyticsResultsContainer
  )
);
