import { combineReducers } from 'redux';
import sources from './sources';
import collections from './collections';
import queries from './queries';
import searches from './searches';

const queriesH = combineReducers({
  queries,
  sources,
  collections,
  searches,
});

export default queriesH;
