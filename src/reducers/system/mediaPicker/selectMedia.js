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

    // toggle a particular item on the list
    case MEDIA_PICKER_SELECT_MEDIA:
      updatedSelectedList = [...state.list];
      // if it is a new item to add to the list
      if (!updatedSelectedList.some(s => s.id === action.payload.id)) {
        const selectedObj = action.payload;
        selectedObj.selected = selectedObj.selected === undefined ? true : !selectedObj.selected;
        updatedSelectedList.push(selectedObj);
      // if there already, treat as a removal/toggle
      } else {
        const mediaIndex = updatedSelectedList.findIndex(s => s.id === action.payload.id);
        // mediaObj.selected = !(mediaObj.selected);
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
