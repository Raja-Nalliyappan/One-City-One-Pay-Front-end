import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // check login
  if (!user) return <Navigate to="/" />; // redirect to login if not logged in
  return children; // render page if logged in
};
