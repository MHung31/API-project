import { csrfFetch } from "./csrf";
const GET_REVIEWS = "reviews/getSpotReviews";
// const ADD_REVIEW = "reviews/addReview";

const getReviews = (spotReviews) => {
  return {
    type: GET_REVIEWS,
    payload: spotReviews,
  };
};

// const addReview = (newReview) => {
//   return {
//     type: addReview,
//     payload: newReview,
//   };
// };

export const getReviewsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const data = await response.json();

    dispatch(getReviews(data.Reviews));
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const addReviewThunk = (review, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const data = response.json();
    return data;
  } else {
    const errors = response.json();
    return errors;
  }
};

const initialState = {};

const reviewsReducer = (reviews = initialState, action) => {
  let newReviews = {};
  switch (action.type) {
    case GET_REVIEWS:
      action.payload?.forEach((review) => {
        newReviews[review.id] = review;
      });
      return newReviews;
    default:
      return reviews;
  }
};

export default reviewsReducer;
