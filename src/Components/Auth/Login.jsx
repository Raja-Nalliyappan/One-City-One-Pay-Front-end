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

    if (event.key === "Enter") {
      fetchLoginUsers();
    }
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
      setIsLoading(true)
      const API = process.env.REACT_APP_API_BASE_URL;
      const url = `${API}/api/Users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const datas = await fetch(url);

      if (!datas.ok) {
        const errorRes = await datas.json();
        seterrorMsg(errorRes.message || "No account found. Sign up.");
        setIsLoading(false)
        return;
      }

      const res = await datas.json();

      const userName = res.user;
      localStorage.setItem("loggedInUser", JSON.stringify({ name: userName, password }));

      setsuccessMsg(res.message);
      setTimeout(() => { ; navigate("/home-page") }, 2000);

    } catch (err) {
      seterrorMsg("Server error - check backend");
    } finally {
      setTimeout(() => setIsLoading(false), 3000);
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

            <form onSubmit={async (e) => {
              e.preventDefault();
              await fetchLoginUsers();
            }}>
              <div className="input-group">
                <label>Email address<span style={{ color: "red" }}>&#x2A;</span></label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  onKeyDown={handleEnterKey}
                  autoComplete="current-email"
                  required
                />
              </div>

              <div className="input-group">
                <label>Password<span style={{ color: "red" }}>&#x2A;</span></label>
                <input
                  placeholder="Enter your password"
                  onChange={(e) => setpassword(e.target.value)}
                  onKeyDown={handleEnterKey}
                  autoComplete="current-password"
                  required type="password"
                />
              </div>

              <div className="forgot-link">
                <Link to="/password-reset-page">Reset your password</Link>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>{isLoading ? "Login..." : "Login"}</button>
            </form>

            <div className="signup-link">Don’t have an account? <Link to="/signup-page">Sign up</Link></div>
          </div>

          <div className="login-illustration">
            <img src={authimage} alt="Illustration" />
          </div>
        </div>
      )}
    </div>
  );
};
