import { combineReducers } from 'redux';
import stats from './stats';
import metadata from './metadata/metadata';
import mediaPicker from './mediaPicker/media';
import topEntitiesPeople from './topEntitiesPeople';
import topEntitiesOrgs from './topEntitiesOrgs';
import recentNews from './recentNews';
import sourceSearch from './sourceSearch';

const system = combineReducers({
  stats,
  metadata,
  mediaPicker,
  topEntitiesPeople,
  topEntitiesOrgs,
  recentNews,
  sourceSearch,
});

export default system;
