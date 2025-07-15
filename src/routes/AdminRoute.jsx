import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, userFromDB } = useContext(AuthContext);
  const location = useLocation();

  if (user === undefined || userFromDB === undefined) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (user && userFromDB?.role === "admin") return children;

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;
