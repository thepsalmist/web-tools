import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncFetch from '../hocs/AsyncContainer';
import StatBar from './StatBar';
import messages from '../../../resources/messages';
import { fetchSystemStats } from '../../../actions/systemActions';
import { humanReadableNumber } from '../../../lib/stringUtil';

const SystemStatsContainer = (props) => {
  const { stats } = props;
  const { formatNumber } = props.intl;

  return (
    <div className="system-stats">
      <StatBar
        columnWidth={4}
        stats={[
          { message: messages.totalStoriesStat, data: humanReadableNumber(stats.total_stories, 3, formatNumber) },
          { message: messages.crawledMediaStat, data: humanReadableNumber(stats.active_crawled_media, 2, formatNumber) },
          { message: messages.dailyStoriesStat, data: humanReadableNumber(stats.daily_stories, 3, formatNumber) },
        ]}
      />
    </div>
  );
};

SystemStatsContainer.propTypes = {
  intl: PropTypes.object.isRequired,
  stats: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  asyncFetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.system.stats.fetchStatus,
  stats: state.system.stats.stats,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchSystemStats());
  },
});

export default
injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    withAsyncFetch(
      SystemStatsContainer
    )
  )
);
