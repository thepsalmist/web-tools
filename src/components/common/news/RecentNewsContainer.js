import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import RecentNews from './RecentNews';

const RecentNewsContainer = props => <RecentNews recentNews={props.recentNews} />;

RecentNewsContainer.propTypes = {
  // from state
  recentNews: PropTypes.object,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.recentNews.fetchStatus,
  recentNews: state.system.recentNews,
});

export default
connect(mapStateToProps)(
  RecentNewsContainer
);
