import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserSpotsThunk } from "../../spots";
import SpotCard from "../LandingPage/SpotCard";
import "./ManageSpots.css";

export default () => {
  const dispatch = useDispatch();
  const userSpots = useSelector((state) => state.spots);
  useEffect(() => {
    dispatch(getUserSpotsThunk());
  }, [dispatch]);
  if (!userSpots) return <div></div>;

  return (
    <div className="manage-spots">
      <h2> Manage Your Spots</h2>
      <button>Create a New Spot</button>
      <div className="manage-spots-index">
        {Object.values(userSpots).map((spot) => {
          return (
            <div className="manage-spots">
              <SpotCard spot={spot} />
              <div id='manage-spots-buttons'>
                <button>Update</button>
                <button>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
