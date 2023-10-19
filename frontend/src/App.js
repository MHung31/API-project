// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./store/components/Navigation";
import CreateSpot from "./store/components/CreateSpot";
import SpotDetails from "./store/components/SpotDetails";
import LandingPage from "./store/components/LandingPage";
import SpotReviews from "./store/components/SpotReviews";
import ManageSpots from "./store/components/ManageSpots";
import UpdateSpot from "./store/components/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/spots/new">
            <CreateSpot />
          </Route>
          <Route path="/spots/current">
            <ManageSpots />
          </Route>
          <Route path="/spots/:id/edit">
            <UpdateSpot />
          </Route>
          <Route path="/spots/:id">
            <SpotDetails />
            <SpotReviews />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
