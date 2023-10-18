import { addSpotDetailsThunk } from "../../spotsDetails";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotReviews.css";
import { getReviewsThunk } from "../../reviews";
import ReviewCard from "./ReviewCard";

export default () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const spotReviews = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getReviewsThunk(id));
  }, [dispatch, id]);

  if (!spotReviews) return <></>;

  const order = Object.keys(spotReviews).sort().reverse();
  
  return (
    <div className="reviews">
      {order.map((key) => (
        <ReviewCard reviewDetails={spotReviews[key]} />
      ))}
    </div>
  );
};
