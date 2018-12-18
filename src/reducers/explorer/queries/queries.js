import { UPDATE_QUERY, UPDATE_QUERY_COLLECTION_LOOKUP_INFO, UPDATE_QUERY_SOURCE_LOOKUP_INFO, ADD_CUSTOM_QUERY, SELECT_SEARCH_BY_ID, SELECT_SEARCH_BY_PARAMS, MARK_AS_DELETED_QUERY, RESET_QUERIES, REMOVE_DELETED_QUERIES, COPY_AND_REPLACE_QUERY_FIELD } from '../../../actions/explorerActions';
import { autoMagicQueryLabel } from '../../../lib/explorerUtil';

const INITIAL_STATE = [];

function queries(state = INITIAL_STATE, action) {
  let updatedState = null;
  let queryIndex = -1;

  findIndex(state, identifier) => {
    state.findIndex(q => q.uuid !== null && q.uuid === identifier);
  }

  switch (action.type) {
    case ADD_CUSTOM_QUERY:
      updatedState = [...state];
      updatedState.push(action.payload);
      return updatedState;
    case UPDATE_QUERY:
      if (action.payload.query) { // update entire query object versus field at a time like in selected reducer
        updatedState = [...state];
        queryIndex = state.findIndex(q => q.index !== null && q.index === action.payload.query.index);
        // we may not have an id if this is a custom query, use index. -- update we may not even use ID... TBD
        queryIndex = queryIndex > -1 ? queryIndex : action.payload.query.index;
        updatedState[queryIndex] = action.payload.query;
        if (updatedState[queryIndex].autoNaming) {
          updatedState[queryIndex].label = autoMagicQueryLabel(updatedState[queryIndex]);
        }
        if (updatedState[queryIndex].q === '*' || updatedState[queryIndex].q === '') {
          updatedState[queryIndex].autoNaming = true;
        }
        return updatedState;
      }
      return null;
    case COPY_AND_REPLACE_QUERY_FIELD: // replace property
      if (action.payload.index !== undefined && action.payload.field) {
        updatedState = [...state];
        updatedState[action.payload.index] = Object.assign({}, updatedState[action.payload.index], action.payload.newValues);
        return updatedState;
      }
      return null;
    case UPDATE_QUERY_SOURCE_LOOKUP_INFO:
      if (action.payload && state && state.length > 0) { // just for safety
        updatedState = [...state];
        queryIndex = state.findIndex(q => q.index !== null && q.index === action.payload.index);
        // we may not have an id if this is a custom query, use index. -- update we may not even use ID... TBD
        queryIndex = queryIndex > -1 ? queryIndex : action.payload.index;
        updatedState[queryIndex].sources = action.payload.sources;
        return updatedState;
      }
      return null;
    case UPDATE_QUERY_COLLECTION_LOOKUP_INFO:
      if (action.payload && state && state.length > 0) { // just for safety
        updatedState = [...state];
        queryIndex = state.findIndex(q => q.index !== null && q.index === action.payload.index);
        // we may not have an id if this is a custom query, use index. -- update we may not even use ID... TBD
        queryIndex = queryIndex > -1 ? queryIndex : action.payload.index;
        updatedState[queryIndex].collections = action.payload.collections;
        return updatedState;
      }
      return null;
    case SELECT_SEARCH_BY_ID:
      if (action.payload) { // make sure searchId is set if present in return results. use index to differentiate queries.
        const queryData = action.payload.queries.map((q, idx) => Object.assign({}, q, { searchId: action.payload.id, id: idx, index: idx }));
        updatedState = queryData;
        return updatedState;
      }
      return state;
    case SELECT_SEARCH_BY_PARAMS: // select this set of queries as passed in by URL
      updatedState = action.payload.map(q => Object.assign({}, q, { autoNaming: q.q === '*' || q.q === '' ? true : q.autoNaming }));
      return updatedState;
    case MARK_AS_DELETED_QUERY:
      if (action.payload) {
        updatedState = [...state];
        if (updatedState.length === 1) return updatedState; // they can't delete all the queries
        queryIndex = updatedState.findIndex(q => q.index !== null && q.index === action.payload.index);

        updatedState[queryIndex].deleted = true;
        return updatedState;
      }
      return state;
    case REMOVE_DELETED_QUERIES:
      return state.filter(q => !q.deleted);
    case RESET_QUERIES:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default queries;
