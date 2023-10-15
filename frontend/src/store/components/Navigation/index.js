import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { getAllSpotsThunk } from "../../spots";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  return (
    <ul>
      <li>
        <NavLink exact to="/">
          Logo airbnb
        </NavLink>
      </li>
      {isLoaded && (
        <>
          <li>
            <NavLink exact to="/spots/new">
              Create a New Spot
            </NavLink>
            <ProfileButton user={sessionUser} />
          </li>
        </>
      )}
    </ul>
  );
}

export default Navigation;
