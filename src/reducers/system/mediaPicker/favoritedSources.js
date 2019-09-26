import { FETCH_FAVORITE_SOURCES, MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST, RESET_MEDIAPICKER_SOURCE_SEARCH } from '../../../actions/systemActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const favoritedSources = createAsyncReducer({
  initialState: {
    list: [],
  },
  action: FETCH_FAVORITE_SOURCES,
  handleSuccess: (payload, state, meta) => ({
    args: { ...meta.args[0], selected: false },
    list: payload.list.map(c => ({
      ...c,
      name: `${c.name}`,
      id: c.media_id,
      type: 'source',
      selected: false,
    })),
  }),
  [MEDIA_PICKER_TOGGLE_MEDIA_IN_LIST]: (payload, state) => ({
    list: state.list.map((c) => {
      if (c.id === payload.selectedMedia.id) {
        return ({
          ...c,
          selected: payload.setSelected,
        });
      }
      return c;
    }),
  }),
  [RESET_MEDIAPICKER_SOURCE_SEARCH]: () => ({ list: [] }),
});

export default favoritedSources;
