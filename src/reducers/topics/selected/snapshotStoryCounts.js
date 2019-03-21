import { FETCH_TOPIC_SNAPSHOT_STORY_COUNTS } from '../../../actions/topicActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const snapshotStoryCounts = createAsyncReducer({
  action: FETCH_TOPIC_SNAPSHOT_STORY_COUNTS,
});

export default snapshotStoryCounts;
