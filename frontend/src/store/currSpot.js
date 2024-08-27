const GET_A_SPOT = 'currSpot/get';

//!normal action creator --> get a spot 
const getASpot = (spot) => {
  return {
    type: GET_A_SPOT,
    payload: spot
  }
};


//! thunk action creator ----> get a spot('api/spot/:id')
export const getASpotThunk = (id) => async(dispatch) => {
  const res = await fetch(`/api/spots/${id}`);

  if (res) {
    const data = await res.json();
    dispatch(getASpot(data));
    return null;
  } else {
    const err = await res.json();
    return err;
  }
};


const currSpotReducer = (state={}, action) => {
  switch (action.type) {

    case GET_A_SPOT: {
      return action.payload;
    }

    default:
      return state;
  }
}

export default currSpotReducer;


