//?This file will contain all the actions specific to the session user's information and the session user's Redux reducer

import { csrfFetch } from "./csrf";

const LOGIN_USER = 'session/login';
const REMOVE_USER = 'session/remove';

//!action creator ----> set the user in the session state
export function loginUser(user) {
  return {
    type: LOGIN_USER,
    payload: user
  }
}

//!action creator ----> remove the user in the session state
export function removeUser() {
  return {
    type: REMOVE_USER,
  }
}

//!thunk action creator ---> set user in session from backend
export const loginUserThunk = (credential, password) => async dispatch => {
  const res = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password
    })
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(loginUser(data.user));
  } else {
    const err = await res.json();
    return err;
  }
}

const initialState = { user: null }

function sessionReducer(state=initialState, action) {
  switch(action.type) {
    case LOGIN_USER: {
      const newState = {
        ...state,
        user: action.payload
      }

      return newState;
    }

    case REMOVE_USER: {
      return initialState;
    }

    default:
      return state;
  }
}

export default sessionReducer;