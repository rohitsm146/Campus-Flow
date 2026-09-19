import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // No login information
  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }

  // Invalid user information
  if (!user || !user.role) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }

  // Role protection
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/admindashboard"
          replace
        />
      );
    }

    if (user.role === "student") {
      return (
        <Navigate
          to="/student/studentdashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;