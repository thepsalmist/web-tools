import getCountryISO2 from 'country-iso-3-to-2'; // ISO 3166-1 lookup, from alpha3 to alpha2
import { GEONAMES_ID_TO_APLHA3 } from './mapUtil';

export const PUBLICATION_COUNTRY = 'publicationCountry';
export const PUBLICATION_STATE = 'publicationState';
export const PRIMARY_LANGUAGE = 'primaryLanguage';
export const COUNTRY_OF_FOCUS = 'countryOfFocus';
export const MEDIA_TYPE = 'mediaType';

export const PUB_COUNTRY_TAG_NAME = 'pub_country';
export const PUB_STATE_TAG_NAME = 'pub_state';
export const PRIMARY_LANGUAGE_TAG_NAME = 'primary_language';
export const COUNTRY_OF_FOCUS_TAG_NAME = 'subject_country';
export const MEDIA_TYPE_TAG_NAME = 'media_format';


// Use this if you want to sort a set of tags by name (it falls back to tag if there is no label)
export function compareTagNames(a, b) {
  const nameA = (a.label || a.tag).toUpperCase(); // ignore upper and lowercase
  const nameB = (b.label || b.tag).toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

export function mediaSourceMetadataProps(mediaSource) {
  return {
    pubCountryTag: mediaSource.metadata.pub_country,
    pubStateTag: mediaSource.metadata.pub_state,
    primaryLangaugeTag: mediaSource.metadata.language,
    countryOfFocusTag: mediaSource.metadata.about_country,
    mediaTypeTag: mediaSource.metadata.media_type,
  };
}

/**
 * Geographic country-level tags have the geonames id and country name encoded into the
 * actual tag string as a hack (because tags can't have arbitraty metadata). This reduxHelpers
 * uses that to add in any metadata needed to render maps. Returns only the country-level items.
 */
export const countryTagsWithAlpha2 = (tagList) => tagList
  .filter(t => t.tag.split('_')[1] in GEONAMES_ID_TO_APLHA3) // grab only the countries
  .map(t => ({
    ...t,
    // grab alpha3 out of the tag string, convert to alpha2 for highcharts
    'iso-a2': getCountryISO2(GEONAMES_ID_TO_APLHA3[parseInt(t.tag.split('_')[1], 10)]),
    value: t.count,
  }));
