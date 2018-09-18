import { FETCH_METADATA_VALUES_FOR_COUNTRY } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const publicationCountry = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
  },
  action: FETCH_METADATA_VALUES_FOR_COUNTRY,
});

export default publicationCountry;
