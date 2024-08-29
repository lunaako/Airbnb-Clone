import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

//!thunk action creator ---> login user(Post api/session router)
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//!thunk action creator ----> restore user session (GET api/session router)
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//!thunk action creator ----> signup user session (POST api/user router)
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//!thunk action creator ----> logout user (DELETE api/session)
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE'
  });
  dispatch(removeUser());
  return response;
};

const GET_SESSION_SPOTS = 'session/get/spots';
const getSessionSpots = (spots) => {
  return {
    type: GET_SESSION_SPOTS,
    payload: spots
  }
}
export const getSessionSpotsThunk = () => async(dispatch) => {
  const res = await fetch('/api/spots/current');
  if (res.ok){
    const data = await res.json();
    const { Spots } = data;
    dispatch(getSessionSpots(Spots));
    console.log(Spots);
    return Spots;
  } else {
    const err = await res.json();
    return err;
  }
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    
    case GET_SESSION_SPOTS: {
      const newState = {...state};
      const normalizedSpots = {};
      action.payload.forEach(spot => {
        normalizedSpots[spot.id] = spot;
      })
      newState.user = {
        ...newState.user,
        spots: normalizedSpots
      }
      return newState;
    }
    default:
      return state;
  }
};

export default sessionReducer;