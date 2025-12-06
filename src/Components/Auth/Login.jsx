import "./Login.css";
import authimage from "../Auth/images/authimage.jpg";
import { useEffect, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import "../CommonCodes/Common.css"

export const Login = () => {
  const [errorMsg, seterrorMsg] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [successMsg, setsuccessMsg] = useState("");

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => seterrorMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);


  function handleEnterKey(event) {
    if (event.key === "Enter") fetchLoginUsers();
  }

  const fetchLoginUsers = async () => {
    if (!email || !password) {
      seterrorMsg("Enter email and password");
      setIsLoading(false);
      return;
    } else if ((email === "admin" || email === "Admin") && password === "12345") {
      setsuccessMsg("Login Successfully")
      setTimeout(() => {
        setIsLoading(false);
        setsuccessMsg("");
        navigate("/admin-page");
      }, 3000);
      return;
    }

    try {
      const url = `https://one-city-one-pay-backend-file.onrender.com/api/Users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const res = await fetch(url);
      const datas = await res.json();

      setIsLoading(true)
      setsuccessMsg(datas.message)
      setTimeout(() => setIsLoading(false), 3000);
      setTimeout(() => { navigate("/home-page") }, 2000);
      localStorage.setItem("loggedInUser", JSON.stringify({ name: datas.user.name, password }));
    } catch (err) {
      // seterrorMsg("Server error - check backend");
      seterrorMsg(datas.message);
    }
  };


  return (
    <div className="login-page">

      {successMsg && <p className="successMsg">{successMsg}</p>}
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-bar-container">
            <div className="loading-bar" id="loading-bar"></div>
          </div>
          <div id="loading-text">Logging in...</div>
        </div>
      ) : (
        <div className="login-card">
          <div className="login-content">
            <h2>Welcome back...</h2>
            <p>Please enter your details</p>

            <div className="input-group">
              <label>Email address<span style={{color:"red"}}>&#x2A;</span></label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                onKeyDown={handleEnterKey}
              />
            </div>

            <div className="input-group">
              <label>Password<span style={{color:"red"}}>&#x2A;</span></label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                onKeyDown={handleEnterKey}
              />
            </div>

            <div className="forgot-link">
              <Link to="/password-reset-page">Reset your password</Link>
            </div>

            <button className="login-btn" onClick={fetchLoginUsers} disabled={isLoading}>
              {isLoading ? "Login..." : "Login"}
            </button>

            <div className="signup-link">
              Don’t have an account? <Link to="/signup-page">Sign up</Link>
            </div>
          </div>

          <div className="login-illustration">
            <img src={authimage} alt="Illustration" />
          </div>
        </div>
      )}
    </div>
  );
};
