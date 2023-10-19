import { Link } from "react-router-dom";
import "./SpotCard.css";

export default ({ spot }) => {
  let { name, id, previewImage, city, state, price, avgRating } = spot;
  const handleClick = () => {};
  const rating =
  avgRating === "There are currently no reviews for this spot"
      ? "New"
      : `${(Math.round(avgRating * 10) / 10).toFixed(2)}`;

  return (
    <div className="card" onClick={handleClick()}>
      <Link to={`/spots/${id}`}>
        <div className="previewImage">
        <div className="spot-name">{name}</div>
          <img src={previewImage} alt="Preview Image Not Available" />
        </div>
        <div className="landing-page-details">
          <div className="location-price">
            <div>{`${city}, ${state}`}</div>
            <div>{`$${price} night`} </div>
          </div>
          <div className="landing-rating">
            <i class="fa-solid fa-star" /> {rating}
          </div>
        </div>
      </Link>
    </div>
  );
};
