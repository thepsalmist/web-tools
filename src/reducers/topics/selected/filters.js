import { LOCATION_CHANGE } from 'react-router-redux';
import { TOPIC_FILTER_BY_SNAPSHOT, TOPIC_FILTER_BY_TIMESPAN, TOPIC_FILTER_BY_FOCUS, TOPIC_FILTER_BY_QUERY } from '../../../actions/topicActions';
import { createReducer } from '../../../lib/reduxHelpers';

function parseId(potentialId) {
  return (Number.isNaN(potentialId) || potentialId === null) ? null : parseInt(potentialId, 10);
}

const info = createReducer({
  initialState: {
    snapshotId: null,
    timespanId: null,
    focusId: null,
    q: null,
  },
  [TOPIC_FILTER_BY_SNAPSHOT]: payload => ({
    snapshotId: parseId(payload),
    timespanId: null,
    focusId: null,
  }),
  [TOPIC_FILTER_BY_FOCUS]: payload => ({
    focusId: parseId(payload),
  }),
  [TOPIC_FILTER_BY_TIMESPAN]: payload => ({
    timespanId: parseId(payload),
  }),
  [TOPIC_FILTER_BY_QUERY]: payload => ({
    q: payload,
  }),
  [LOCATION_CHANGE]: (payload, state) => {
    // for some reason when the user hits the back button we need to manually re-render
    // if the timespan has changed
    const updates = {};
    if (payload.query.timespanId !== undefined) {
      const newTimespanId = parseInt(payload.query.timespanId, 10); // gotta intify it, since it comes from url as string
      if (newTimespanId !== state.timespanId) {
        updates.timespanId = newTimespanId;
      }
    }
    return updates;
  },
});

export default info;
