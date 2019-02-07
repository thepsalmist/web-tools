import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import withAsyncData from '../../common/hocs/AsyncDataContainer';
import LoadingSpinner from '../../common/LoadingSpinner';
import ActiveFiltersContainer from '../controlbar/ActiveFiltersContainer';
import { FilterButton } from '../../common/IconButton';
import { filterByTimespan, filterByFocus, filterByQuery } from '../../../actions/topicActions';

const localMessages = {
  topicRunning: { id: 'topic.topicRunning', defaultMessage: 'We are scraping the web for all the stories in include in your topic.' },
  filterTopic: { id: 'topic.filter', defaultMessage: 'Filter this Topic' },
};

class FilteredTopicContainer extends React.Component {
  setupFilterControls() {
    const { formatMessage } = this.props.intl;
    // give HOC components to render in the filter control in control bar
    return (
      <div>
        <FilterButton tooltip={formatMessage(localMessages.filterTopic)} />
        <ActiveFiltersContainer />
      </div>
    );
  }

  filtersAreSet() {
    const { filters, topicId } = this.props;
    return ((topicId !== null) && (filters.snapshotId !== null) && (filters.timespanId !== null));
  }

  hasUsableSnapshot() {
    const { snapshots } = this.props;
    const hasUsableSnapshot = snapshots.filter(d => d.isUsable);
    return (hasUsableSnapshot.length > 0);
  }

  render() {
    const { children, filters } = this.props;
    // If the generation process is still ongoing, ask the user to wait a few minutes
    let childContent = children;
    if (this.filtersAreSet()) {
      // show spinner until there is a valid timespan
      if (filters.timespanId) {
        childContent = children;
      } else {
        childContent = <LoadingSpinner />;
      }
    }
    return (
      childContent
    );
  }
}

FilteredTopicContainer.propTypes = {
  // from compositional chain
  intl: PropTypes.object.isRequired,
  children: PropTypes.node,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  fetchStatusInfo: PropTypes.string,
  // from state
  filters: PropTypes.object.isRequired,
  topicId: PropTypes.number.isRequired,
  topicInfo: PropTypes.object.isRequired,
  snapshots: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  topicId: state.topics.selected.id,
  fetchStatus: state.topics.selected.info.fetchStatus,
  fetchStatusInfo: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  params: ownProps.params,
  snapshots: state.topics.selected.snapshots.list,
});

const fetchAsyncData = (dispatch, { location }) => {
  // get filters
  const { query } = location;
  if (location.query.focusId) {
    dispatch(filterByFocus(query.focusId));
  }
  if (location.query.timespanId) {
    dispatch(filterByTimespan(query.timespanId));
  }
  if (location.query.q) {
    dispatch(filterByQuery(query.q));
  }
};

export default
injectIntl(
  connect(mapStateToProps)(
    withAsyncData(fetchAsyncData)(
      FilteredTopicContainer
    )
  )
);
