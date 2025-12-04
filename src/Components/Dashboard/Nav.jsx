import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Nav.css";

const tabsData = [
  { type: "home", label: "Dashboard", icon: "🏠", path: "/home-page" },
  { type: "bike", label: "Bikes", icon: "🚲", path: "/bike-page"},
  { type: "auto", label: "Auto", icon: "🛺", path: "/auto-page" },
  { type: "car", label: "Cars", icon: "🚗", path: "/cars-page" },
  { type: "bus", label: "Buses", icon: "🚌", path: "/bus-page" },
  { type: "metro", label: "Metro", icon: "🚇", path: "/metro-page" },
  { type: "train", label: "Train", icon: "🚆", path: "/local-train" },
];

export const Nav = () => {
  const location = useLocation(); 
  const [activeTab, setActiveTab] = useState();

const handleTabClick = (tabType) => {
    setActiveTab(tabType);
  };

  return (
    <nav className="tabs">
      {tabsData.map((tab) => (
        <Link
          key={tab.type}
          to={tab.path}
          onClick={() => handleTabClick(tab.type)}
          className={`tab ${location.pathname === tab.path || activeTab === tab.type ? "active" : ""}`}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
};
