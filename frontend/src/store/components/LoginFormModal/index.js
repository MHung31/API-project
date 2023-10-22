// frontend/src/components/LoginFormPage/index.js
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    const response = await dispatch(
      sessionActions.login({ credential, password })
    );
    if (response.message) {
      setErrors("The provided credentials were invalid");
    } else {
      closeModal();
      history.push("/");
    }
  };

  const demoUser = (e) => {
    alert("Feature coming soon");
  };

  useEffect(() => {
    setButtonDisabled(true);
    if (credential.length >= 4 && password.length >= 6)
      setButtonDisabled(false);
  }, [credential, password]);

  return (
    <div id="loginForm">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div id="login-error">{errors}</div>
        <label>Username or Email</label>

        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={buttonDisabled} type="submit">
          Log In
        </button>
      </form>
      <h3 onClick={demoUser}>Demo User</h3>
    </div>
  );
}

export default LoginFormModal;
