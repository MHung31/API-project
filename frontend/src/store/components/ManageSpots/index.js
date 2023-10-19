import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getUserSpotsThunk } from "../../spots";
import SpotCard from "../LandingPage/SpotCard";
import "./ManageSpots.css";
import { addSpotDetailsThunk } from "../../spotsDetails";

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userSpots = useSelector((state) => state.spots);
  useEffect(() => {
    dispatch(getUserSpotsThunk());
  }, [dispatch]);

  const updateClick = (id) => {
    return function () {
      history.push(`/spots/${id}/edit`);
    };
  };

  const deleteClick = (id) => {
    return function () {
      //delete spot delete pot spot thunk
      //delete it from redux store and also call to remove it from db
      //add useEffect to rerender if number of spots are different
    };
  };

  const createClick = () => {

      history.push("/spots/new");
    
  };

  if (!userSpots) return <div></div>;

  return (
    <div className="manage-spots">
      <h2> Manage Your Spots</h2>
      <button onClick={createClick}>Create a New Spot</button>
      <div className="manage-spots-index">
        {Object.values(userSpots).map((spot) => {
          return (
            <div>
              <SpotCard spot={spot} />
              <div id="manage-spots-buttons">
                <button onClick={updateClick(spot.id)}>Update</button>
                <button>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
