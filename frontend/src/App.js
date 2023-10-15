// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./store/components/Navigation";
import CreateSpot from "./store/components/CreateSpot";
import SpotDetails from './store/components/SpotDetails'

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
          <Route path="/spots/new">
            <CreateSpot />
          </Route>
          <Route path="/spots/:id">
            <SpotDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
