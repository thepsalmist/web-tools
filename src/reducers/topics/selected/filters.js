// import { LOCATION_CHANGE } from 'react-router-redux';
import { TOPIC_FILTER_BY_SNAPSHOT, TOPIC_FILTER_BY_TIMESPAN, TOPIC_FILTER_BY_FOCUS,
  TOPIC_FILTER_BY_QUERY, UPDATE_TOPIC_FILTER_PARSING_STATUS } from '../../../actions/topicActions';
import { createReducer } from '../../../lib/reduxHelpers';
import { parseId } from '../../../lib/numberUtil';

export const FILTER_PARSING_UNDEFINED = 'undefined';
export const FILTER_PARSING_ONGOING = 'ongoing';
export const FILTER_PARSING_DONE = 'done';

const info = createReducer({
  initialState: {
    parsingStatus: FILTER_PARSING_UNDEFINED,
    snapshotId: null,
    timespanId: null,
    focusId: null,
    q: null,
  },
  [UPDATE_TOPIC_FILTER_PARSING_STATUS]: (payload, state) => {
    const newStatus = payload;
    if (state.parsingStatus !== newStatus) {
      return { parsingStatus: newStatus };
    }
    return null;
  },
  [TOPIC_FILTER_BY_SNAPSHOT]: (payload, state) => {
    const newSnapshotId = parseId(payload);
    // be extra safe here to proteect against topics in weird states with pseudo snapshots that don't have real ids
    if ((newSnapshotId > 0) && (state.snapshotId !== newSnapshotId)) {
      return { snapshotId: newSnapshotId, focusId: null, timespanId: null };
    }
    return null;
  },
  [TOPIC_FILTER_BY_FOCUS]: (payload, state) => {
    const newFocusId = parseId(payload);
    if (state.focusId !== newFocusId) {
      return { focusId: newFocusId, timespanId: null };
    }
    return null;
  },
  [TOPIC_FILTER_BY_TIMESPAN]: (payload, state) => {
    const newTimespanId = parseId(payload);
    if (state.timespanId !== newTimespanId) {
      return { timespanId: newTimespanId };
    }
    return null;
  },
  [TOPIC_FILTER_BY_QUERY]: (payload, state) => {
    const newQuery = payload;
    if (state.q !== newQuery) {
      return { q: newQuery };
    }
    return null;
  },

/*
  [LOCATION_CHANGE]: (payload, state) => {
    // TODO: evalue removing this
    // for some reason when the user hits the back button we need to manually re-render
    // if the timespan has changed
    if (payload.query.timespanId !== undefined) {
      const newTimespanId = parseInt(payload.query.timespanId, 10); // gotta intify it, since it comes from url as string
      if (newTimespanId !== state.timespanId) {
        return { timespanId: newTimespanId };
      }
    }
    // no changes to make to the state
    return undefined;
  },
*/
});

export default info;
