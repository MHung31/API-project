import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css";
import { addSpotDetailsThunk } from "../../spotsDetails";

export default () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const spotDetails = useSelector((state) => state.spotsDetails[id]);
  let previewImage = "";
  const otherImages = [];

  const handleClick = (e) => {
    alert("Feature coming soon");
  };

  useEffect(() => {
    dispatch(addSpotDetailsThunk(id));
  }, [dispatch, id]);

  if (!spotDetails) return <div></div>;

  const {
    name,
    city,
    state,
    country,
    SpotImages,
    Owner,
    avgStarRating,
    numReviews,
    description,
    price,
  } = spotDetails;

  SpotImages.forEach((image) => {
    if (image.preview) {
      previewImage = image.url;
    } else otherImages.push(image.url);
  });


  return (
    <div className="details">
      <h1>{name}</h1>
      <h2>{`${city}, ${state}, ${country}`}</h2>

      <div className="imageList">
        <div id="previewImage">
          <img src={previewImage} alt="Preview Image" />
        </div>
        <div id="otherImages">
          {otherImages.map((image) => {
            return <img src={image} alt="No Image" />;
          })}
        </div>
      </div>
      <div className="spotDetails">
        <div className="description">
          <h2>
            Hosted by {Owner["firstName"]} {Owner["lastName"]}
          </h2>
          <p>{description}</p>
        </div>

        <div className="reserve">
          <div className="reserveDetails">
            <div>
              {`$${price} `}
              <span>night</span>
            </div>
            <div>{`*New`}</div>
          </div>
          <button onClick={handleClick}>Reserve</button>
        </div>
      </div>
    </div>
  );
};
