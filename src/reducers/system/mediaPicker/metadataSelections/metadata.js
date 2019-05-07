import { combineReducers } from 'redux';
import publicationCountry from './publicationCountry';
import publicationState from './publicationState';
import primaryLanguage from './primaryLanguage';
import countryOfFocus from './countryOfFocus';
import mediaType from './mediaType';

const metadata = combineReducers({
  publicationCountry,
  publicationState,
  primaryLanguage,
  countryOfFocus,
  mediaType,
});

export default metadata;
