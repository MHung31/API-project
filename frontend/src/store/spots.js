import { csrfFetch } from "./csrf";

const NEW_SPOT = "spots/new";
const GET_ALL_SPOTS = "spots/ALL";
const GET_USER_SPOTS = "spots/currentUser";

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
    dispatch(newSpot(data));
    return data;
  } else {
    const error = await response.json();
    return error;
  }
};

export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    dispatch(getAllSpots(data.Spots));
    return data;
  } else {
    const error = await response.json();
    return error;
  }
};

export const getUserSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  if (response.ok) {
    const data = await response.json();
    dispatch(getAllSpots(data.Spots));
    return data;
  } else {
    const error = await response.json();
    return error;
  }
};

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const error = await response.json();
    return error;
  }
};

const initialState = {};
const spotsReducer = (spots = initialState, action) => {
  let allSpots = { ...spots };
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
