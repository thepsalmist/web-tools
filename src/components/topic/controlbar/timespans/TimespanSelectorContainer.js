import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { filterByTimespan, toggleTimespanControls, setTimespanVisiblePeriod }
  from '../../../../actions/topicActions';
import TimespanSelector from './TimespanSelector';

const TimespanSelectorContainer = (props) => {
  const { timespans, selectedTimespan, setExpanded, handleTimespanSelected, handlePeriodSelected,
    isVisible, selectedPeriod } = props;
  let content = null;
  if ((timespans.length > 0) && selectedTimespan && selectedPeriod) {
    content = (
      <TimespanSelector
        timespans={timespans}
        isExpanded={isVisible}
        selectedPeriod={selectedPeriod}
        selectedTimespan={selectedTimespan}
        onTimespanSelected={handleTimespanSelected}
        onPeriodSelected={handlePeriodSelected}
        setExpanded={setExpanded}
      />
    );
  }
  return (
    <div className="timespan-selector-wrapper">
      {content}
    </div>
  );
};

TimespanSelectorContainer.propTypes = {
  // from parent
  topicId: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  handleTimespanSelected: PropTypes.func.isRequired,
  setExpanded: PropTypes.func.isRequired,
  handlePeriodSelected: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  timespans: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  selectedPeriod: PropTypes.string,
  snapshotId: PropTypes.number.isRequired,
  timespanId: PropTypes.number,
  selectedTimespan: PropTypes.object,
};

// helper to update the url and fire off event
function updateTimespan(dispatch, location, timespan, /* shouldPush */) {
  dispatch(filterByTimespan(timespan.timespans_id));
}

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.timespans.fetchStatus,
  timespans: state.topics.selected.timespans.list,
  timespanId: state.topics.selected.filters.timespanId,
  snapshotId: state.topics.selected.filters.snapshotId,
  isVisible: state.topics.selected.timespans.isVisible,
  selectedPeriod: state.topics.selected.timespans.selectedPeriod,
  selectedTimespan: state.topics.selected.timespans.selected,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handlePeriodSelected: (period, firstTimespanInPeriod) => {
    dispatch(setTimespanVisiblePeriod(period));
    updateTimespan(dispatch, ownProps.location, firstTimespanInPeriod, true);
  },
  setExpanded: (isExpanded) => {
    dispatch(toggleTimespanControls(isExpanded));
  },
  handleTimespanSelected: (timespan) => {
    updateTimespan(dispatch, ownProps.location, timespan, true);
  },
});

export default
connect(mapStateToProps, mapDispatchToProps)(
  TimespanSelectorContainer
);
