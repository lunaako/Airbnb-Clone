import { csrfFetch } from "./csrf";

const GET_ALLSPOTS = 'spots/get-all';

//! normal action creator ---> get all spots
const getAllSpots = (spots) => {
  return {
    type: GET_ALLSPOTS,
    payload: spots
  }
};

//! thunk action creator ----> get all spots('/api/spots')
export const getAllSpotsThunk = () => async(dispatch) => {
  const res = await fetch('/api/spots');
  
  if (res.ok) {
    const data = await res.json();
    dispatch(getAllSpots(data));
    return null;
  } else {
    const err = await res.json();
    return err;
  }
};

const CREATE_SPOT = 'spots/create';
//! normal action creator ---> create a new spot
const createSpot = (spot) => {
  return {
    type:CREATE_SPOT,
    payload: spot
  }
};

//! thunk action creator ----> create a new spot (POST, '/api/spots')
export const createSpotThunk = (spot) => async(dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spot)
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(createSpot(data));
    return data;
  } else {
    const err = await res.json();
    return err;
  }
};

const DELETE_SPOT = 'spots/delete';
const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    payload: spotId
  }
}
export const deleteSpotThunk = (spotId) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    dispatch(deleteSpot(spotId));
    return null;
  } else {
    const err = await res.json();
    return err;
  }
}

const spotsReducer = (state={}, action) => {
  switch (action.type) {
    case GET_ALLSPOTS: {
      const newState = {...state};
      const spotsArr = action.payload.Spots;
      spotsArr.forEach(obj => {
        newState[obj.id] = obj
      });
      newState.page = action.payload.page;
      newState.size = action.payload.size;
      return newState;
    }

    case CREATE_SPOT: {
      const spotId = action.payload.id;
      const newState = {
        ...state, 
        [spotId]: action.payload
      }
      return newState;
    }

    case DELETE_SPOT: {
      const newState = {...state};
      delete newState[action.payload];
      return newState;
    }

    default:
      return state;
  }
}

export default spotsReducer;