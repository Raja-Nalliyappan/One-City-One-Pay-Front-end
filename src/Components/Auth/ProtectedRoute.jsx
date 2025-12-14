import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user, redirect to login page
  if (!user) return <Navigate to="/" />;

  // If user exists, render the protected page
  return children;
};
