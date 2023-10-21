import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllSpotsThunk } from "../../spots";
import SpotCard from "./SpotCard.js";
import './LandingPage.css'

export default () => {
  const dispatch = useDispatch();
  const allSpots = useSelector((state) => state.spots);

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);
  if (!allSpots) return <div></div>;
  return (
    <div className="index">
      {Object.values(allSpots).map((spot) => {
        return <SpotCard spot={spot} />;
      })}
    </div>
  );
};
