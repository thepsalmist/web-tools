import { MEDIA_PICKER_SELECT_MEDIA, MEDIA_PICKER_INITIALIZE_ALREADY_SELECTED_MEDIA, MEDIA_PICKER_CLEAR_SELECTED_MEDIA, MEDIA_PICKER_UNSELECT_MEDIA, MEDIA_PICKER_SELECT_MEDIA_CUSTOM_COLL } from '../../../actions/systemActions';
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
      updatedSelectedList = updatedSelectedList.map(c => ({ ...c, selected: true, id: c.tags_id || c.media_id || c.id }));
      return { list: updatedSelectedList };

    // update a particular item on the list, source, collection, or search. Search id is generated in SourceSelectContainer for new Custom searches and in python for URL loading
    // this should work - the list is updated according to newly selected media
    // however, the list tags field is somehow updated for all of the list entries
    // maybe the problem is that this is a list
    // but I'm trying to update it with one object at time?
    // somewhere the updated tags is getting added to every item in selectedMedia..
    // as if a singular tags object itself is added to select media
    case MEDIA_PICKER_SELECT_MEDIA:
      updatedSelectedList = [...state.list];
      if (action.payload.id !== undefined) {
        const mediaIndex = updatedSelectedList.findIndex(s => s.id === action.payload.id);
        if (mediaIndex > -1 && !action.payload.customColl) { // we don't update custom searches, just add
          updatedSelectedList[mediaIndex] = action.payload; // in display check matches
        } else if (!action.payload.customColl) {
          updatedSelectedList.push(action.payload);
        }
        return { list: updatedSelectedList };
      }
      return state;
    case MEDIA_PICKER_SELECT_MEDIA_CUSTOM_COLL:
      updatedSelectedList = [...state.list];
      if (action.payload.id !== undefined) {
        const newObj = {};
        newObj.mediaKeyword = action.payload.mediaKeyword;
        newObj.customColl = action.payload.customColl;
        const testObj = {};
        Object.keys(action.payload.tags).forEach((t) => { // for each tag
          const valArray = Object.values(action.payload.tags[t]);
          testObj[t] = [...valArray]; // explicitly clone each array that is in each tags obj
        });
        newObj.tags = testObj;
        updatedSelectedList.push(newObj);
        return { list: updatedSelectedList };
      }
      return state;
    case MEDIA_PICKER_UNSELECT_MEDIA:
      updatedSelectedList = { ...state };
      if (action.payload.id !== undefined) {
        const mediaIndex = updatedSelectedList.findIndex(s => s.id === action.payload.id);
        if (mediaIndex > -1) { // we don't update custom searches, just add
          updatedSelectedList[mediaIndex] = action.payload; // in display check matches
          updatedSelectedList.pop(mediaIndex);
        }
        return { list: updatedSelectedList };
      }
      return state;
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
