import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import * as sessionActions from "../../session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (password !== confirmPassword) {
      setErrors({ password: "Passwords must match" });
      return;
    }
    const response = await dispatch(
      sessionActions.signup({
        email,
        username,
        firstName,
        lastName,
        password,
      })
    );
    console.log(response);
    if (response.errors) {
      setErrors(response.errors);
    } else {
      closeModal();
      history.push("/");
    }
  };
  useEffect(() => {
    setButtonDisabled(true);
    if ((email, username, firstName, lastName, password, confirmPassword))
      setButtonDisabled(false);
  }, [email, username, firstName, lastName, password, confirmPassword]);

  return (
    <div id="signup-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email <span className="signupErrors">{errors.email}</span>
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>
            Username <span className="signupErrors">{errors.username}</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            First Name <span className="signupErrors">{errors.firstName}</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>
            Last Name <span className="signupErrors">{errors.lastName}</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="signupErrors">{errors.password}</div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button disabled={buttonDisabled} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
