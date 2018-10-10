import { FETCH_ALL_MEDIA_INLINKS, SORT_MEDIA_INLINKS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const inlinks = createAsyncReducer({
  initialState: {
    sort: 'inlink',
    stories: [],
    links_ids: {},
  },
  action: FETCH_ALL_MEDIA_INLINKS,
  [SORT_MEDIA_INLINKS]: payload => ({ sort: payload }),
});

export default inlinks;
