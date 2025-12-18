import "./Header.css"
import logo from "../Dashboard/Dashboard-images/One-City-One-Pay-Logo.png"
import { useNavigate } from 'react-router-dom';
import loginprofile from "../Dashboard/loginprofile.gif"

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

  let loginUsername = JSON.parse(localStorage.getItem("user")).name;

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="header-center">
          <h1>Plan Your Journey – Book Tickets and Travel with Ease</h1>
        </div>

        <div className="loginProfile">
          <div className="dropdown"><img src={loginprofile} width={40} height={40} alt="loginprofile" className="dropbtn"/>
            <div className="dropdown-content">
              <p>{loginUsername}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>


      </header>
    </>
  );
};