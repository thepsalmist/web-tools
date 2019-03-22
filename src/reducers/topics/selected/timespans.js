import moment from 'moment';
// import { LOCATION_CHANGE } from 'react-router-redux';
import { FETCH_TOPIC_TIMESPANS_LIST, TOGGLE_TIMESPAN_CONTROLS, TOPIC_FILTER_BY_FOCUS,
  SET_TIMESPAN_VISIBLE_PERIOD, TOPIC_FILTER_BY_TIMESPAN, TOPIC_FILTER_BY_SNAPSHOT }
  from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';
import { parseId } from '../../../lib/numberUtil';

function addJsDates(list) {
  return list.map(timespan => ({
    ...timespan,
    startDateMoment: moment(timespan.start_date),
    endDateMoment: moment(timespan.end_date),
    startDateObj: moment(timespan.start_date).toDate(),
    endDateObj: moment(timespan.end_date).toDate(),
  }));
}

function getTimespanFromListById(list, id) {
  const result = list.find(element => element.timespans_id === id);
  return (result === undefined) ? null : result;
}

const initialState = {
  list: [],
  isVisible: true,
  selectedId: null, // annoying that I have to keep this here too... topic.filters should be the one true source of this info :-(
  selected: null,
  selectedPeriod: 'overall',
};

const timespans = createAsyncReducer({
  initialState,
  action: FETCH_TOPIC_TIMESPANS_LIST,
  // this needs to update the selected info, in case the seleceted id came from the url
  handleSuccess: (payload, state) => ({
    list: addJsDates(payload.list),
    selected: getTimespanFromListById(addJsDates(payload.list), state.selectedId),
    selectedPeriod: (state.selectedId) ? getTimespanFromListById(addJsDates(payload.list), state.selectedId).period : null,
  }),
  [TOPIC_FILTER_BY_SNAPSHOT]: () => initialState, // when snapshot changes reset these
  [TOPIC_FILTER_BY_FOCUS]: () => initialState, // when focus changes reset these
  [TOGGLE_TIMESPAN_CONTROLS]: payload => ({ isVisible: payload }),
  [SET_TIMESPAN_VISIBLE_PERIOD]: payload => ({ selectedPeriod: payload }),
  [TOPIC_FILTER_BY_TIMESPAN]: (payload, state) => {
    const selected = getTimespanFromListById(state.list, parseId(payload));
    return {
      selectedId: parseId(payload),
      selected,
      selectedPeriod: selected ? selected.period : 'custom',
    };
  },
/*
  [LOCATION_CHANGE]: (payload, state) => {
    // for some reason when the user hits the back button we need to manually re-render
    // if the timespan has changed
    const updates = {};
    if (state.list.length === 0) { // bail if we haven't fetched list from server yet (ie. page load)
      return updates;
    }
    if (payload.query.timespanId) {
      const newTimespanId = parseInt(payload.query.timespanId, 10); // gotta intify it, since it comes from url as string
      if (newTimespanId !== state.selected) {
        const selected = getTimespanFromListById(state.list, newTimespanId);
        updates.selectedId = newTimespanId;
        updates.selected = selected;
        updates.selectedPeriod = selected.period;
      }
    }
    return updates;

  },
*/
});

export default timespans;
