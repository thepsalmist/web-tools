import { combineReducers } from 'redux';
import all from './all';
import definitions from './definitions';
import create from './create/create';
import foci from './foci';

export const isUrlSharingFocalSet = (focalSet) => (focalSet.name === 'URL Sharing');

export const hasAUrlSharingFocalSet = (focalSets) => focalSets.map(fs => isUrlSharingFocalSet(fs)).reduce((combined, current) => combined || current, false);

const focalSetsReducer = combineReducers({
  all,
  create,
  definitions,
  foci,
});

export default focalSetsReducer;
