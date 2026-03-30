import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles = [] }) => {

  const token = localStorage.getItem("accessToken");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;