import { useState } from "react";
import "./ResetPassword.css";
import axios from "axios";
import "../CommonCodes/Common.css";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const passValid = (newPassword) => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*@)[A-Za-z\d@]{8,}$/.test(newPassword);
  }

  const resetPassword = async () => {
    if (!email || !newPassword) {
      showError("Please enter both email and new password.");
      return;
    }

    if(!passValid(newPassword)){
      showError("Password must 8 characters, including uppercase, lowercase, number, and '@' symbol.");
      return 
    }


    setLoading(true);
    try {
      const res = await axios.post("https://localhost:7172/api/Users/reset-password", {
        email,
        newPassword,
      });
      showSuccess(res.data.message || "Password reset successfully!");
      setEmail("");
      setNewPassword("");
    } catch (err) {
      showError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "150px auto", textAlign: "center" }}>
      <h2>Reset Password</h2>

      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      {successMsg && <p className="successMsg">{successMsg}</p>}

      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button
        onClick={resetPassword}
        style={{ padding: "10px 20px", marginBottom: "10px" }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Reset Password"}
      </button>

      <div>
        <button
          onClick={() => navigate("/login-page")}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #555",
            color: "#333",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Login
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
        </div>
      )}
    </div>
  );
};
