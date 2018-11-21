import { FETCH_ALL_MEDIA_OUTLINKS, SORT_MEDIA_OUTLINKS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const outlinks = createAsyncReducer({
  initialState: {
    sort: 'inlink',
    stories: [],
    links_ids: {},
  },
  action: FETCH_ALL_MEDIA_OUTLINKS,
  [SORT_MEDIA_OUTLINKS]: payload => ({ sort: payload }),
});

export default outlinks;
