import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchRecentNews } from '../../../actions/systemActions';
import withAsyncData from '../hocs/AsyncDataContainer';
import RecentNewsMenu from './RecentNewsMenu';

const MAX_ITEMS = 8;

const RecentNewsMenuContainer = ({ recentNews }) => (
  <React.Fragment>
    {recentNews && (
      <RecentNewsMenu
        newsItems={recentNews[0].notes.slice(0, MAX_ITEMS)}
        subTitle={moment(recentNews[0].date, 'YYYY-M-DD').fromNow()}
      />
    )}
  </React.Fragment>
);

RecentNewsMenuContainer.propTypes = {
  // from parent
  // from state
  recentNews: PropTypes.array,
  // from compositional chain
};

const mapStateToProps = state => ({
  fetchStatus: state.system.recentNews.fetchStatus,
  recentNews: state.system.recentNews.releases,
});

const fetchAsyncData = dispatch => dispatch(fetchRecentNews());

export default
connect(mapStateToProps)(
  withAsyncData(fetchAsyncData)(
    RecentNewsMenuContainer
  )
);
