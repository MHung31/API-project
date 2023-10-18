import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li id="logo">
        <NavLink exact to="/">
          <div className="logo">
            <i class="fa-brands fa-airbnb" /> <span>skybnb</span>
          </div>
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
