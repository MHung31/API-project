import { Link } from "react-router-dom";
import "./SpotCard.css";

export default ({ spot }) => {
  let { id, previewImage, city, state, price, avgRating } = spot;
  const handleClick = () => {};
  if ((avgRating = "There are currently no reviews for this spot"))
    avgRating = "New";
  return (
    <div className="card" onClick={handleClick()}>
      <Link to={`/spots/${id}`}>
        <div className="previewImage">
          <img src={previewImage} alt="Preview Image Not Available" />
        </div>
        <div className="landing-page-details">
          <div className="location-price">
            <div>{`${city}, ${state}`}</div>
            <div>{`$${price} night`} </div>
          </div>
          <div className="rating">
            <i class="fa-solid fa-star" /> {avgRating}
          </div>
        </div>
      </Link>
    </div>
  );
};
