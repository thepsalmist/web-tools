import { resolve, reject } from 'redux-simple-promise';
import Raven from 'raven-js';
import { LOGIN_WITH_PASSWORD, LOGIN_WITH_COOKIE, RESET_API_KEY } from '../actions/userActions';
import * as fetchConstants from '../lib/fetchConstants';

const INITIAL_STATE = {
  fetchStatus: fetchConstants.FETCH_INVALID,
  isLoggedIn: false,
  key: null,
};

function setRavenUserContext(userInfo) {
  if (userInfo) {
    Raven.setUserContext({ email: userInfo.email });
  }
}

function resetRavenUserContext() {
  Raven.setUserContext();
}

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_WITH_PASSWORD:
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_ONGOING,
        isLoggedIn: false,
        ...action.payload,
      });
    case resolve(LOGIN_WITH_PASSWORD):
      setRavenUserContext(action.payload);
      const passwordLoginWorked = (action.payload.status !== 500);
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        isLoggedIn: passwordLoginWorked,
        ...action.payload,
      });
    case reject(LOGIN_WITH_PASSWORD):
      resetRavenUserContext();
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
        isLoggedIn: false,
      });

    case LOGIN_WITH_COOKIE:
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_ONGOING,
        isLoggedIn: false,
        ...action.payload,
      });
    case resolve(LOGIN_WITH_COOKIE):
      setRavenUserContext(action.payload);
      const keyLoginWorked = (action.payload.status !== 401);
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_SUCCEEDED,
        isLoggedIn: keyLoginWorked,
        ...action.payload,
      });
    case reject(LOGIN_WITH_COOKIE):
      resetRavenUserContext();
      return Object.assign({}, state, {
        fetchStatus: fetchConstants.FETCH_FAILED,
        isLoggedIn: false,
        key: null,
      });

    case resolve(RESET_API_KEY):
      return Object.assign({}, state, {
        key: action.payload.profile.api_key,
        profile: action.payload.profile,
      });
    default:
      return state;
  }
}
