import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotDetails.css";
import { addSpotDetailsThunk } from "../../spotsDetails";
import OpenModalMenuItem from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import { useModal } from "../../../context/Modal";

export default () => {
  const sessionUser = useSelector((state) => state.session.user);
  console.log(sessionUser);
  const dispatch = useDispatch();
  const { setModalContent, setOnModalClose } = useModal();
  const { id } = useParams();
  const spotDetails = useSelector((state) => state.spotsDetails[id]);
  const spotReviews = useSelector((state) => state.reviews);
  let previewImage = "";
  const otherImages = [];

  const handleClick = (e) => {
    alert("Feature coming soon");
  };

  const SubmitReview = (e) => {
    setModalContent(<ReviewFormModal spotId={id} />);
  };

  useEffect(() => {
    dispatch(addSpotDetailsThunk(id));
  }, [dispatch, id, spotReviews]);

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

  const rating =
    avgStarRating === "There are currently no reviews for this spot"
      ? "New"
      : `${(Math.round(avgStarRating * 10) / 10).toFixed(2)} • ${numReviews} ${
          numReviews === 1 ? "Review" : "Reviews"
        }`;

  SpotImages.forEach((image) => {
    if (image.preview) {
      previewImage = image.url;
    } else otherImages.push(image.url);
  });

  return (
    <>
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
              <div id="spot-rating">
                <i class="fa-solid fa-star" /> {rating}
              </div>
            </div>
            <button onClick={handleClick}>Reserve</button>
          </div>
        </div>
      </div>
      <div id="review-details-header">
        <h3>
          <i class="fa-solid fa-star" /> {rating}
        </h3>
        <button
          id="post-review-button"
          onClick={SubmitReview}
          hidden={!sessionUser}
        >
          Post Your Review
        </button>
      </div>
    </>
  );
};
