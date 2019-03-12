import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../hocs/AsyncDataContainer';
import StatBar from './StatBar';
import messages from '../../../resources/messages';
import { fetchSystemStats } from '../../../actions/systemActions';
import { humanReadableNumber } from '../../../lib/stringUtil';

const SystemStatsContainer = props => (
  <div className="system-stats">
    <StatBar
      columnWidth={4}
      stats={[
        { message: messages.totalStoriesStat, data: humanReadableNumber(props.stats.total_stories, 3, props.intl.formatNumber) },
        { message: messages.crawledMediaStat, data: humanReadableNumber(props.stats.active_crawled_media, 2, props.intl.formatNumber) },
        { message: messages.dailyStoriesStat, data: humanReadableNumber(props.stats.daily_stories, 3, props.intl.formatNumber) },
      ]}
    />
  </div>
);

SystemStatsContainer.propTypes = {
  // from HOCs
  intl: PropTypes.object.isRequired,
  // from store
  fetchStatus: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.stats.fetchStatus,
  stats: state.system.stats.stats,
});

const fetchAsyncData = dispatch => dispatch(fetchSystemStats());

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      SystemStatsContainer
    )
  )
);
