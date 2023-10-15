import { csrfFetch } from "./csrf";

const ADD_SPOT_IMAGE = "spots/image/add";

const addSpotImage = (image) => {
  return {
    type: ADD_SPOT_IMAGE,
    payload: image,
  };
};

export const addSpotImageThunk = (images, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(images[0]),
  }).then(() => {
    if (images.length > 1) {
      images.slice(1).forEach(async (image) => {
        await csrfFetch(`/api/spots/${spotId}/images`, {
          method: "POST",
          body: JSON.stringify(image),
        });
      });
    }
  });
};

//No Reducer needed for images?
