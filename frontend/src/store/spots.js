import { csrfFetch } from "./csrf";

const NEW_SPOT = "spots/new";
const GET_ALL_SPOTS = "spots/ALL";

const newSpot = (spot) => {
  return {
    type: NEW_SPOT,
    payload: spot,
  };
};

const getAllSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    payload: spots,
  };
};

export const newSpotThunk = (spot) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spot),
  });

  if (response.ok) {
    const data = await response.json();
    return dispatch(newSpot(data));
  } else {
    const error = await response.json();
    return error;
  }
};

export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    return dispatch(getAllSpots(data.Spots));
  } else {
    const error = await response.json();
    return error;
  }
};

const initialState = {};
const spotsReducer = (spots = initialState, action) => {
  let allSpots = {};
  switch (action.type) {
    case NEW_SPOT:
      allSpots = { ...spots, [action.payload.id]: action.payload };
      return allSpots;
    case GET_ALL_SPOTS:
      action.payload.forEach((spot) => {
        allSpots[spot.id] = spot;
      });
      return allSpots;
    default:
      return spots;
  }
};

export default spotsReducer;
