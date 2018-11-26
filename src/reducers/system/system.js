import { combineReducers } from 'redux';
import stats from './stats';
import metadata from './metadata/metadata';
import mediaPicker from './mediaPicker/media';
import topEntitiesPeople from './topEntitiesPeople';
import topEntitiesOrgs from './topEntitiesOrgs';
import recentNews from './recentNews';
import sourceSearch from './sourceSearch';
import users from './users/users';

const system = combineReducers({
  stats,
  metadata,
  mediaPicker,
  topEntitiesPeople,
  topEntitiesOrgs,
  recentNews,
  sourceSearch,
  users,
});

export default system;
