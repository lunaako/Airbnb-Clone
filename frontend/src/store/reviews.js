import { csrfFetch } from "./csrf";

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

const CREATE_REVIEW = 'reviews/create';
//! normal action creator ---> create a review for a spot
const createReview = (review,) => {
  return {
    type: CREATE_REVIEW,
    payload: review
  }
}

//! thunk action creator ----> create a new review(POST /api/)
export const createReviewThunk = (review, stars, spotId) => async(dispatch) => {

  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({review, stars}),
  });

  if (res.ok) {
    console.log("ok");
    const data = await res.json();
    // console.log(data);
    return data;
  } else {
    const err = await res.json();
    return err;
  }
}

//!create action for delete a review
const DELETE_REVIEW = 'reviews/'

const reviewsReducer = (state={}, action) => {
  switch(action.type) {
    case GET_REVIEWS: {
      let newState = {};
      const reviews = action.payload.Reviews;
      reviews.forEach(review => {
        newState[review.id] = review;
      })
      return newState;
    }

    case CREATE_REVIEW: {
      const review = action.payload;
      const newState = {
        ...state,
        [review.id]: review
      }
      return newState;
    }

    default:
      return state;
  }
}

export default reviewsReducer;
