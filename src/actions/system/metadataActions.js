import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/system';

export const FETCH_METADATA_VALUES_FOR_COUNTRY = 'FETCH_METADATA_VALUES_FOR_COUNTRY';
export const FETCH_METADATA_VALUES_FOR_STATE = 'FETCH_METADATA_VALUES_FOR_STATE';
export const FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE = 'FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE';
export const FETCH_METADATA_VALUES_FOR_COUNTRY_OF_FOCUS = 'FETCH_METADATA_VALUES_FOR_COUNTRY_OF_FOCUS';
export const FETCH_METADATA_VALUES_FOR_MEDIA_TYPE = 'FETCH_METADATA_VALUES_FOR_MEDIA_TYPE';


export const fetchMetadataValuesForCountry = createAsyncAction(FETCH_METADATA_VALUES_FOR_COUNTRY, api.metadataValuesForCountry);

export const fetchMetadataValuesForState = createAsyncAction(FETCH_METADATA_VALUES_FOR_STATE, api.metadataValuesForState);

export const fetchMetadataValuesForPrimaryLanguage = createAsyncAction(FETCH_METADATA_VALUES_FOR_PRIMARY_LANGUAGE, api.metadataValuesForPrimaryLanguage);

export const fetchMetadataValuesForCountryOfFocus = createAsyncAction(FETCH_METADATA_VALUES_FOR_COUNTRY_OF_FOCUS, api.metadataValuesForCountryOfFocus);

export const fetchMetadataValuesForMediaType = createAsyncAction(FETCH_METADATA_VALUES_FOR_MEDIA_TYPE, api.metadataValuesForMediaType);
