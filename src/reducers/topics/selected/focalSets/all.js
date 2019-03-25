import { resolve } from 'redux-simple-promise';
import { FETCH_TOPIC_FOCAL_SETS_LIST, TOPIC_FILTER_BY_SNAPSHOT, FETCH_FOCAL_SET_DEFINITIONS,
  CREATE_FOCAL_SET_DEFINITION, DELETE_FOCAL_SET_DEFINITION, CREATE_FOCUS_DEFINITION, DELETE_FOCUS_DEFINITION,
  CREATE_RETWEET_FOCUS_SET, CREATE_TOP_COUNTRIES_FOCUS_SET, CREATE_NYT_THEME_FOCUS_SET, CREATE_MEDIA_TYPE_FOCUS_SET }
  from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

// Return true if there are focal set changes that require a new snapshot
function pendingFocalSetDefinitions(definitions, focalSets) {
  // has match?
  const eachHasMatch = definitions.map((setDef) => {
    // for each focal set definition make sure a set exists
    const matchingSet = focalSets.find(set => setDef.name === set.name && setDef.description === set.description);
    if (matchingSet) {
      // make sure length is same (ie. no deleted defs)
      if (matchingSet.foci.length !== setDef.focus_definitions.length) {
        return false;
      }
      // for each focus definined make sure a focus exists in that set
      const macthingFoci = setDef.focus_definitions.map((def) => {
        const matchingFocus = matchingSet.foci.find(focus => def.name === focus.name && def.query === focus.query && def.description === focus.description);
        return matchingFocus !== undefined;
      });
      return !macthingFoci.includes(false);
    }
    return false;
  });
  return eachHasMatch.includes(false);
}

const initialState = {
  list: [],
  newDefinitions: false,
};

const markAsHavingNewDefinitions = () => ({ newDefinitions: true });

const all = createAsyncReducer({
  initialState,
  action: FETCH_TOPIC_FOCAL_SETS_LIST,
  [TOPIC_FILTER_BY_SNAPSHOT]: () => initialState, // when snapshot changes reset these
  handleSuccess: payload => ({
    list: payload,
  }),
  // and track when there is a new focal set definition, so that we show that you need to generate a new version
  [resolve(FETCH_FOCAL_SET_DEFINITIONS)]: (listOfFocalSetDefs, state) => ({
    newDefinitions: pendingFocalSetDefinitions(listOfFocalSetDefs, state.list),
  }),
  [resolve(CREATE_FOCAL_SET_DEFINITION)]: markAsHavingNewDefinitions,
  [resolve(DELETE_FOCAL_SET_DEFINITION)]: markAsHavingNewDefinitions,
  [resolve(CREATE_FOCUS_DEFINITION)]: markAsHavingNewDefinitions,
  [resolve(DELETE_FOCUS_DEFINITION)]: markAsHavingNewDefinitions,
  [resolve(CREATE_RETWEET_FOCUS_SET)]: markAsHavingNewDefinitions,
  [resolve(CREATE_TOP_COUNTRIES_FOCUS_SET)]: markAsHavingNewDefinitions,
  [resolve(CREATE_NYT_THEME_FOCUS_SET)]: markAsHavingNewDefinitions,
  [resolve(CREATE_MEDIA_TYPE_FOCUS_SET)]: markAsHavingNewDefinitions,

});

export default all;
