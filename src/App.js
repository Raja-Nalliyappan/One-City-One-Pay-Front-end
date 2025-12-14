import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { Login } from "./Components/Auth/Login";
import { Register } from "./Components/Auth/Register";
import { Dashboard } from "./Components/Dashboard/Dashboard";
import { Bike } from "./Components/Dashboard/Dashboard-Vehicles/Bike";
import { Car } from "./Components/Dashboard/Dashboard-Vehicles/Car";
import { Metro } from "./Components/Dashboard/Dashboard-Vehicles/Metro";
import { LocalTrain } from "./Components/Dashboard/Dashboard-Vehicles/Local-Train";
import { Bus } from "./Components/Dashboard/Dashboard-Vehicles/Bus";
import { Auto } from "./Components/Dashboard/Dashboard-Vehicles/Auto";
import { Admin } from "./Components/Admin/Admin";
import { ResetPassword } from "./Components/Auth/ResetPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element = {<Login />} />
          <Route path="signup-page" element = {<Register />} />
          <Route path="login-page" element = {<Login />} />
          <Route path="password-reset-page" element = {<ResetPassword />} />
          <Route path="admin-page" element = {<Admin />} />
          <Route path="home-page" element = {<Dashboard />} />
            <Route path="bike-page" element = {<Bike />} />
            <Route path="cars-page" element = {<Car />} />
            <Route path="metro-page" element = {<Metro />} />
            <Route path="local-train" element = {<LocalTrain />} />
            <Route path="bus-page" element = {<Bus />} />
            <Route path="auto-page" element = {<Auto />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
