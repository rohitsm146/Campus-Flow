import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Registration failed."
        );
        return;
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 1500);

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card register-card">

        {/* Logo */}
        <div className="auth-logo">
          Campus Flow
        </div>

        {/* Heading */}
        <h1 className="auth-title">
          Create Account
        </h1>

        <p className="auth-subtitle">
          Register as a student and join Campus Flow
        </p>

        {/* Register Form */}
        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          {/* Name */}
          <div className="auth-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {/* Error */}
          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p
              style={{
                margin: "-2px 0 0",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#059669",
                fontSize: "13px",
                lineHeight: "1.4",
              }}
            >
              {success}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p className="auth-footer">

          Already have an account?{" "}

          <Link to="/">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;