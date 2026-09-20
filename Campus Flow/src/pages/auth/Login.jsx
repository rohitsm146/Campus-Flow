import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Clear previous session in THIS TAB only
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      const response = await fetch(
        "https://campus-flow-backend-6ega.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Validate backend response
      if (
        !data.token ||
        !data.user ||
        !data.user.id ||
        !data.user.role
      ) {
        setError("Invalid login response from server.");
        return;
      }

      // Save login session for THIS TAB only
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      console.log("Logged in user:", data.user);

      // Redirect according to backend role
      if (data.user.role === "student") {
        navigate("/student/studentdashboard", {
          replace: true,
        });

        return;
      }

      if (data.user.role === "admin") {
        navigate("/admin/admindashboard", {
          replace: true,
        });

        return;
      }

      // Unknown role
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      setError("Invalid user role received from server.");
    } catch (error) {
      console.error("Login error:", error);

      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          Campus Flow
        </div>

        {/* Heading */}
        <h1 className="auth-title">
          Welcome Back!
        </h1>

        <p className="auth-subtitle">
          Login to your Campus Flow account
        </p>

        {/* Login Form */}
        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          {/* Email */}
          <div className="auth-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          {/* Password */}
          <div className="auth-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {/* Role */}
          <div className="auth-role">

            <span className="auth-role-label">
              Login as
            </span>

            <div className="auth-role-options">

              <label className="auth-role-option">

                <input
                  type="radio"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                />

                <span>
                  Student
                </span>

              </label>

              <label className="auth-role-option">

                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                />

                <span>
                  Admin
                </span>

              </label>

            </div>

          </div>

          {/* Error */}
          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;