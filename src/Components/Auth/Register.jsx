import "./Register.css";
import authimage from "../Auth/images/register.jpg";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setsuccessMsg] = useState("");

  const navigate = useNavigate();

  const timerRef = useRef(null);

  useEffect(() => {
    if (!error) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setError("");
      timerRef.current = null;
    }, 3000);

    return () => clearTimeout(timerRef.current);
  }, [error]);


  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  // const passValid = (password) => {
  //   return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*@)[A-Za-z\d@]{8,}$/.test(password);
  // }

  function handleEnterKey(event){
    if(event.key === "Enter"){
      signinsubmit();
    }
  }

  //Validation function
  const signinsubmit = async (e) => {
    
    if (!username.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your email address.");
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    if (!phoneNumber.trim()) return setError("Please enter your phone number.");
    if (phoneNumber.length !== 10) return setError("Phone number must be exactly 10 digits.");
    if (!password.trim()) return setError("Please enter a password.");
    // if (!passValid(password)) return setError("Password must 8 characters, including uppercase, lowercase, number, and '@' symbol.");
    if (confirmPassword !== password) return setError("Passwords do not match.");

    const userData = {
      name: username,
      email: email,
      phone: phoneNumber,
      password: password
    }

    try {
      const API = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(`${API}/api/Users`, userData);
      setsuccessMsg(res.data);

      setTimeout(() => {
        navigate("/login-page");
      }, 1500);


    } catch (err) {
      console.error(err);

      if (err.response) {
        if (err.response.status === 409) {
          setError(err.response.data); // duplicate user
        } else {
          setError(err.response.data || "Failed to register user. Try again!");
        }
      } else {
        setError("Failed to register user. Try again!");
      }
    }
  };


  return (
    <div className="register-page">

      {error && <div className="error-box">{error}</div>}
      {successMsg && <div className="successMsg-box">{successMsg}</div>}

      <div className="register-content">
        <h2>Create your account</h2>
        <p>Please fill in the details below</p>

        <div className="input-group">
          <label>Full Name<span style={{color:"red"}}>&#x2A;</span></label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleEnterKey}
          />
        </div>

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
          <label>Phone Number<span style={{color:"red"}}>&#x2A;</span></label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numericValue = inputValue.replace(/\D/g, "");
              if (numericValue.length <= 10) { setPhoneNumber(numericValue) }
             
            }}
             onKeyDown={handleEnterKey}
          />
        </div>

        <div className="input-group">
          <label>Password<span style={{color:"red"}}>&#x2A;</span></label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onKeyDown={handleEnterKey}
          />
        </div>

        <div className="input-group">
          <label>Confirm Password<span style={{color:"red"}}>&#x2A;</span></label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            onKeyDown={handleEnterKey}
          />
        </div>

        <button className="register-btn" onClick={signinsubmit}>
          Sign in
        </button>

        <div className="login-link">
          Already have an account? <Link to="/login-page">Login</Link>
        </div>
      </div>

      <div className="illustration">
        <img src={authimage} alt="Illustration" />
      </div>
    </div>
  );
};
