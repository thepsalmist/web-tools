import { createAsyncReducer } from '../../../../../lib/reduxHelpers';
import { SELECT_SOURCE_FEED, FETCH_SOURCE_FEED } from '../../../../../actions/sourceActions';


const feeds = createAsyncReducer({
  initialState: {
    feed: null,
    feedId: 0,
  },
  action: FETCH_SOURCE_FEED,
  handleSuccess: payload => ({
    sourceId: payload.feed.media_id,
    feed: { ...payload.feed, active: payload.feed.active },
    feedId: payload.feeds_id,
  }),
  [SELECT_SOURCE_FEED]: payload => ({
    sourceId: payload.sourceId,
    feedId: payload.feedId,
  }),
});
export default feeds;
