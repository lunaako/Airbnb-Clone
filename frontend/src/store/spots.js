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

    default:
      return state;
  }
}

export default spotsReducer;