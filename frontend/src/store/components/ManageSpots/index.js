import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getUserSpotsThunk, deleteSpotThunk } from "../../spots";
import SpotCard from "../LandingPage/SpotCard";
import "./ManageSpots.css";
import { addSpotDetailsThunk } from "../../spotsDetails";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import {useModal} from '../../../context/Modal'

export default () => {
  const { setModalContent } = useModal();
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
      //Pass delete thunk and ID to confirm delete modal
      //delete it from redux store and also call to remove it from db
      //add useEffect to rerender if number of spots are different
      setModalContent(<ConfirmDeleteModal type='Spot' deleteFunc={deleteSpotThunk} id={id}/>)
    
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
                <button onClick={deleteClick(spot.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
