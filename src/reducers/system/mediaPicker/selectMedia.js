import { MEDIA_PICKER_SELECT_MEDIA, MEDIA_PICKER_INITIALIZE_ALREADY_SELECTED_MEDIA, MEDIA_PICKER_CLEAR_SELECTED_MEDIA } from '../../../actions/systemActions';
// import { PICK_COLLECTION, PICK_SOURCE, ADVANCED  } from '../../../../lib/explorerUtil';

// we may not need this...

const INITIAL_STATE = {
  list: [],
};

function selectMedia(state = INITIAL_STATE, action) {
  let updatedSelectedList = [];
  switch (action.type) {
    // recieving a whole new list of media to show
    case MEDIA_PICKER_INITIALIZE_ALREADY_SELECTED_MEDIA:
      updatedSelectedList = [...action.payload];
      updatedSelectedList = updatedSelectedList.map(c => ({ ...c, selected: true, id: c.tags_id ? c.tags_id : c.media_id }));
      return { list: updatedSelectedList };

    // update a particular item on the list, source, collection, or search
    case MEDIA_PICKER_SELECT_MEDIA:
      updatedSelectedList = [...state.list];
      if (!updatedSelectedList.some(s => s.id !== undefined && s.id === action.payload.id)) {
        // newly selected
        const selectedObj = action.payload;
        selectedObj.selected = selectedObj.selected === undefined ? true : !selectedObj.selected;
        updatedSelectedList.push(selectedObj);
      } else if (action.payload.id !== undefined) {
        const mediaIndex = updatedSelectedList.findIndex(s => s.id === action.payload.id);
        updatedSelectedList.splice(mediaIndex, 1); // in display check matches
      }
      return { list: updatedSelectedList };

    // empty the whole thing out
    case MEDIA_PICKER_CLEAR_SELECTED_MEDIA: // maybe we want this...
      // removed from selected list
      updatedSelectedList = [];
      return { list: updatedSelectedList };

    default:
      return state;
  }
}

export default selectMedia;
