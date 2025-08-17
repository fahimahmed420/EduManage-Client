import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const TeacherRoute = ({ children }) => {
  const { user, userFromDB } = useContext(AuthContext);
  const location = useLocation();

  if (user === undefined || userFromDB === undefined) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-blue-600">Checking Authentication...</div>;
  }

  if (user && userFromDB?.role === "teacher" || user && userFromDB?.role === "admin") return children;

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default TeacherRoute;
