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
  }).then(async () => {
    if (images.length > 1) {
      const otherImages = images.slice(1)
      for (let image of otherImages){

        await csrfFetch(`/api/spots/${spotId}/images`, {
          method: "POST",
          body: JSON.stringify(image),
        });
      }
    }
  });
};

export const deleteSpotImagesThunk = (imagesArr) => async (dispatch) => {

  for (let imageId of imagesArr) {
      await csrfFetch(`/api/spot-images/${imageId}`, {
        method: "DELETE",
      });
  }
};
//No Reducer needed for images?
