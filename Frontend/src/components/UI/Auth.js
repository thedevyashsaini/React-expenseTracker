import { useState } from "react";

import "./Auth.css";

const Auth = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emptyUser, setEmptyUser] = useState(false);
  const [emptyName, setEmptyName] = useState(false);
  const [emptyEmail, setEmptyEmail] = useState(false);
  const [emptyPass, setEmptyPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const setLoading = (value) => {
    props.isLoading(value);
  };

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const loginHandler = (event) => {
    event.preventDefault();
    if (username.trim().length === 0) {
        setEmptyUser(true);
        return;
    }
    if (password.trim().length === 0) {
        setEmptyPass(true);
        return;
    }
    setUsername("");
    setPassword("");
    setLoading(true);
    props.onSubmit(username, password);
  };

  const signupHandler = (event) => {
    event.preventDefault();
    if (name.trim().length === 0) {
        setEmptyName(true);
        return;
    }
    if (email.trim().length === 0) {
        setEmptyEmail(true);
        return;
    }
    if (username.trim().length === 0) {
        setEmptyUser(true);
        return;
    }
    if (password.trim().length === 0) {
        setEmptyPass(true);
        return;
    }
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setLoading(true);
    props.onSubmit(name, email, username, password);
  };

  return (
    <div className="login-card">
      <div className="login-card-content">
        <form onSubmit={props.isLogin ? loginHandler : signupHandler}>
            <div className="header">
            <div className={props.loading ? "logo load" : "logo"} >
                <img
                src="https://itc.gymkhana.iitb.ac.in/wncc/assets/images/logo-large.png"
                alt="logo"
                style={{ width: "80%" }}
                />
            </div>
            <h2 style={{display: props.loading ? "none" : ""}}>
                Expense<span className="highlight">Tracker</span>
            </h2>
            <p style={{color: "#ffb9b9", display: !props.loading && props.inValid.error ? "block" : "none"}}>{props.inValid.message}</p>
            </div>
            <div className="form" style={{display: props.loading ? "none" : ""}}>
            <div className="form-field name" style={{display: props.isLogin ? "none" : ""}}>
                <div className="icon">
                <i className="far fa-user"></i>
                </div>
                <input
                value={name}
                type="text"
                placeholder="Name"
                onChange={nameChangeHandler}
                className={emptyName ? "invalid" : ""}
                />
            </div>
            <div className="form-field email" style={{display: props.isLogin ? "none" : ""}}>
                <div className="icon">
                <i className="fa-solid fa-at"></i>
                </div>
                <input
                value={email}
                type="text"
                placeholder="Email"
                onChange={emailChangeHandler}
                className={emptyEmail ? "invalid" : ""}
                />
            </div>
            <div className="form-field username">
                <div className="icon">
                <i class="fa-solid fa-user-gear"></i>
                </div>
                <input
                value={username}
                type="text"
                placeholder="Username"
                onChange={usernameChangeHandler}
                className={emptyUser ? "invalid" : ""}
                />
            </div>
            <div className="form-field password">
                <div className="icon">
                <i className="fas fa-lock"></i>
                </div>
                <input
                value={password}
                type="password"
                placeholder="Password"
                onChange={passwordChangeHandler}
                className={emptyPass ? "invalid" : ""}
                />
            </div>

            <button className="login" type="submit">
                {props.isLogin ? "Login" : "Signup"}
            </button>
            <div>
                {props.isLogin ? "Don't have an account?" : "Already have an account?"} <span className="btn" onClick={props.onChangeClick}>{ props.isLogin ? "Sign Up Now" : "Log In Now"}</span>
            </div>
            </div>
        </form>
      </div>
      <div className="login-card-footer" style={{display: props.loading ? "none" : ""}}>
        <span className="btn" style={{"display": props.isLogin ? "" : "none"}}>Forgot password?</span>
      </div>
    </div>
  );
};

export default Auth;
