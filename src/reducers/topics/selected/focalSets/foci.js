import { FETCH_TOPIC_FOCAL_SETS_LIST, TOPIC_FILTER_BY_FOCUS } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { parseId } from '../../../../lib/numberUtil';

function getFocusFromListById(list, id) {
  const result = list.find(element => element.foci_id === id);
  return (result === undefined) ? null : result;
}

const list = createAsyncReducer({
  initialState: {
    list: [],
    selectedId: null,
    selected: null,
  },
  action: FETCH_TOPIC_FOCAL_SETS_LIST,
  handleSuccess: (payload, state) => {
    const foci = [];
    payload.forEach((fs) => {
      const focalSet = Object.assign({}, fs, { });
      delete focalSet.foci;
      foci.push(...fs.foci.map(focus => Object.assign({}, focus, { focalSet })));
    });
    // since the selectedId might have been from the url before we had the list, make sure to update the selected object
    let selected = null;
    if (state.selectedId !== null) {
      selected = getFocusFromListById(foci, state.selectedId);
    }
    return { list: foci, selected };
  },
  [TOPIC_FILTER_BY_FOCUS]: (payload, state) => {
    const selectedId = parseId(payload);
    // this might fail, in the case where the id comes from the url, before we have fetched the list
    const selected = getFocusFromListById(state.list, selectedId);
    return { selectedId, selected };
  },

});

export default list;
