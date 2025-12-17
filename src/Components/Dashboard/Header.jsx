import "./Header.css"
import logo from "../Dashboard/Dashboard-images/One-City-One-Pay-Logo.png"
import {useNavigate} from 'react-router-dom';

export const Header = () => {

  //logout
  const navigate = useNavigate();
  const handleLogout = () => {
    const LogoutConfirmation = window.confirm("You have been logged out!")
    if (LogoutConfirmation) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login-page")
    }
  }

  return (
    <>
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="header-center">
        <h1>Plan Your Journey – Book Tickets and Travel with Ease</h1>
      </div>

      <div className="header-right">
        <a href="#" className="logout-btn" onClick={handleLogout}>Logout</a>
      </div>
    </header>
    </>
  );
};