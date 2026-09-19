import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = sessionStorage.getItem("token");
  const userData = sessionStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Invalid user data:", error);

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }

  if (
    !user ||
    !user.id ||
    !user.role ||
    !["student", "admin"].includes(user.role)
  ) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
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
  }

  return children;
}

export default ProtectedRoute;