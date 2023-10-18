import { csrfFetch } from "./csrf";

const ADD_SPOT = "spotDetails/add";

const addSpot = (spotDetails) => {

  return {
    type: ADD_SPOT,
    payload: spotDetails,
  };
};

export const addSpotDetailsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const data = await response.json();

    dispatch(addSpot(data));
    return data;
  } else {
    const error = await response.json();
    return error;
  }
};

const initialState = {};

const spotsDetailsReducer = (spotsDetails = initialState, action) => {
  let newSpotsDetails = {};
  switch (action.type) {
    case ADD_SPOT:

      newSpotsDetails = { ...spotsDetails };
      if (!newSpotsDetails[action.payload.id]) {
        newSpotsDetails[action.payload.id] = action.payload;
      }
      return newSpotsDetails;
    default:
      return spotsDetails;
  }
};

export default spotsDetailsReducer;
