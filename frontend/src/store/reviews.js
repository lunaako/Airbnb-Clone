const GET_REVIEWS ='reviews/get';

//! normal action creator ---> get all reviews based on a spot id
const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    payload: reviews
  }
}

//! thunk action creator ----> get all reviews by a spot's id(api/spots/:id/reviews)
export const getReviewsThunk = (spotId) => async(dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const data = await res.json();
    dispatch(getReviews(data));
    return null;
  } else {
    const err = await res.json();
    return err;
  }
}

const reviewsReducer = (state={}, action) => {
  switch(action.type) {
    case GET_REVIEWS: {
      let newState = {};
      const reviews = action.payload.Reviews;
      reviews.forEach(review => {
        newState[review.spotId] = review;
      })
      return newState;
    }

    default:
      return state;
  }
}

export default reviewsReducer;
