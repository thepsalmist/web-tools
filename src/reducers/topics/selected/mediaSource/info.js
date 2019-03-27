import { FETCH_MEDIA, SELECT_MEDIA } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { mediaSourceMetadataProps } from '../../../../lib/tagUtil';
import { parseId } from '../../../../lib/numberUtil';

const info = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_MEDIA,
  [SELECT_MEDIA]: payload => ({ id: payload }),
  handleSuccess: payload => ({
    ...payload,
    media_id: parseId(payload.media_id),
    ...mediaSourceMetadataProps(payload),
  }),
});

export default info;
