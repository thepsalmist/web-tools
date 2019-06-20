import { SELECT_METADATA_QUERY_ARGS } from '../../../../actions/systemActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const mediaType = createAsyncReducer({
  initialState: {
    tags: [],
    label: null,
    value: false,
  },
  action: SELECT_METADATA_QUERY_ARGS,
  handleSuccess: payload => ({
    tags: payload.tags.map(c => ({
      ...c,
      selected: false,
    })),
  }),
});

export default mediaType;
