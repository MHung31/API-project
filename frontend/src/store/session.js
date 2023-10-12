import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

const initialState = { user: null };

const sessionReducer = (session = initialState, action) => {
  let newSession;
  switch (action.type) {
    case SET_USER:
      newSession = {...session};
      newSession.user = action.payload;
      return newSession;
    case REMOVE_USER:
      newSession = {...session};
      newSession.user = null;
      return newSession;
    default:
      return session;
  }
};

export default sessionReducer;
