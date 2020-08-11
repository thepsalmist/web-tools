import { combineReducers } from 'redux';
import stats from './stats';
import metadata from './metadata/metadata';
import mediaPicker from './mediaPicker/media';
import recentNews from './recentNews';
import sourceSearch from './sourceSearch';
import users from './users/users';
import analytics from './analytics/analytics';
import staticTags from './staticTags';

const system = combineReducers({
  stats,
  metadata,
  mediaPicker,
  recentNews,
  sourceSearch,
  users,
  analytics,
  staticTags,
});

export default system;
