import { csrfFetch } from "./csrf";

const ADD_IMG = 'spotImage/add';
const addImg = ({ img, spotId }) => {
  return {
    type: ADD_IMG,
    payload: { img, spotId }
  }
};
export const addImgThunk = (img, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    body: JSON.stringify(img)
  })

  if (res.ok) {
    const data = await res.json();
    dispatch(addImg({ img: data, spotId }));
    return data;
  } else {
    const err = await res.json();
    return err;
  }
}

const spotImageReducer = (state ={}, action) => {
  switch(action.type) {
    case ADD_IMG: {
      const newState = { ...state };
      const { img, spotId } = action.payload;
      const imgId = img.id;
      newState[imgId] = img;
      newState[imgId].spotId = spotId;
      return newState;
    }

    default:
      return state;
  }
}

export default spotImageReducer;