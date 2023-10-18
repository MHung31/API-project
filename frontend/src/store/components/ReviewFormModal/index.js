import { useState } from "react";

import "./ReviewForm.css";

const ReviewFormModal = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>How was your stay?</h2>
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
          class={`fa-${tempStars[0] ||stars[0]} fa-star`}
        />
        <i
          onMouseOver={() => setTempRating(2)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(2)}
          class={`fa-${tempStars[1] ||stars[1]} fa-star`}
        />
        <i
          onMouseOver={() => setTempRating(3)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(3)}
          class={`fa-${tempStars[2] ||stars[2]} fa-star`}
        />
        <i
          onMouseOver={() => setTempRating(4)}
          onMouseOut={() => setTempRating(0)}
          onClick={() => setRating(4)}
          class={`fa-${tempStars[3] ||stars[3]} fa-star`}
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
