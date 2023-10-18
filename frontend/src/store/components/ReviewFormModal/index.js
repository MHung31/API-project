import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addReviewThunk } from "../../reviews.js";
import { useModal } from "../../../context/Modal";
import { getReviewsThunk } from "../../reviews";

import "./ReviewForm.css";

const ReviewFormModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const [validationErrors, setValidationErrors] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const stars = ["regular", "regular", "regular", "regular", "regular"];
  for (let i = 0; i < rating; i++) {
    stars[i] = "solid";
  }
  let tempStars = [];
  if (tempRating) {
    tempStars = ["regular", "regular", "regular", "regular", "regular"];
    for (let i = 0; i < tempRating; i++) {
      tempStars[i] = "solid";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const finalReview = {
      review,
      stars: rating,
    };

    const response = await dispatch(addReviewThunk(finalReview, spotId));
    if (validationErrors) return;

    if (response.message) {
      setValidationErrors(response.message);
    } else {
      dispatch(getReviewsThunk(spotId));
      closeModal();
    }
  };

  useEffect(() => {
    setValidationErrors("");
    if (!rating) setValidationErrors("Rating is required");
    if (!review) setValidationErrors("Review is required");
  }, [review, rating]);

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>How was your stay?</h2>
      <p id="review-form-error">{submitted && validationErrors}</p>
      <textarea
        id="review-description"
        onChange={(e) => setReview(e.target.value)}
        value={review}
        placeholder="Leave your review here..."
      />
      <div className="review-form-rating">
        <i
          onMouseOver={() => setTempRating(1)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(1)}
          class={`fa-${tempStars[0] || stars[0]} fa-star`}
        />
        <i
          onMouseOver={() => setTempRating(2)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(2)}
          class={`fa-${tempStars[1] || stars[1]} fa-star`}
        />
        <i
          onMouseOver={() => setTempRating(3)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(3)}
          class={`fa-${tempStars[2] || stars[2]} fa-star`}
        />
        <i
          onMouseOver={() => setTempRating(4)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(4)}
          class={`fa-${tempStars[3] || stars[3]} fa-star`}
        />
        <i
          onMouseOver={() => setTempRating(5)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(5)}
          class={`fa-${tempStars[4] || stars[4]} fa-star`}
        />
        <span>Stars</span>
      </div>

      <button>Submit Your Review</button>
    </form>
  );
};

export default ReviewFormModal;
