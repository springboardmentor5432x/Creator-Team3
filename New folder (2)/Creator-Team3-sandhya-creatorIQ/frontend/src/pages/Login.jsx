import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

export default function Login({ setToken }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "creator") {
        navigate("/creator", { replace: true });
      }

      if (
        role === "brand" ||
        role === "brand agency"
      ) {
        navigate("/brand", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loginResponse = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            Email: email.trim(),
            Password: password,
          }),
        }
      );

      const loginData =
        await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(
          loginData.detail ||
            "Invalid email or password"
        );
      }

      const accessToken =
        loginData.access_token;

      if (!accessToken) {
        throw new Error(
          "Access token was not received"
        );
      }

      const userResponse = await fetch(
        `${API_URL}/user`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

      const userData =
        await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(
          userData.detail ||
            "Unable to get user details"
        );
      }

      const userRole = String(
        userData.role || ""
      )
        .toLowerCase()
        .trim();

      if (!userRole) {
        throw new Error(
          "User role was not received"
        );
      }

      localStorage.setItem(
        "token",
        accessToken
      );

      localStorage.setItem(
        "role",
        userRole
      );

      localStorage.setItem(
        "email",
        userData.Email || email.trim()
      );

      if (setToken) {
        setToken(accessToken);
      }

      if (userRole === "creator") {
        navigate("/creator", {
          replace: true,
        });
      } else if (
        userRole === "brand" ||
        userRole === "brand agency"
      ) {
        navigate("/brand", {
          replace: true,
        });
      } else {
        throw new Error(
          "Unknown user role: " + userRole
        );
      }

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        setError(
          "Cannot connect to backend. Make sure FastAPI is running on port 8000."
        );
      } else {
        setError(
          error.message ||
            "Login failed"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-logo">
          ◈
        </div>

        <h1>CreatorIQ</h1>

        <p className="login-subtitle">
          Sign in to your analytics dashboard
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <div className="login-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />

          </div>

          <div className="login-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
            />

          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <p className="login-register-text">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="login-register-link"
          >
            Create Account
          </Link>

        </p>

      </div>

      <style>{`

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #020617;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          padding: 42px;
          border-radius: 20px;
          background: #111827;
          border: 1px solid #1e293b;
          box-shadow:
            0 25px 60px
            rgba(0, 0, 0, 0.45);
          color: white;
        }

        .login-logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #06b6d4
            );
          font-size: 30px;
        }

        .login-card h1 {
          margin: 0;
          text-align: center;
          font-size: 32px;
        }

        .login-subtitle {
          text-align: center;
          color: #94a3b8;
          margin-bottom: 30px;
        }

        .login-error {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 10px;
          background: #451a1a;
          color: #fca5a5;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-form-group label {
          color: #cbd5e1;
          font-size: 14px;
        }

        .login-form-group input {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #1e293b;
          color: white;
          outline: none;
        }

        .login-form-group input:focus {
          border-color: #3b82f6;
        }

        .login-button {
          padding: 14px;
          border: none;
          border-radius: 10px;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #06b6d4
            );
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-register-text {
          margin-top: 25px;
          text-align: center;
          color: #94a3b8;
        }

        .login-register-link {
          color: #60a5fa;
          text-decoration: none;
          font-weight: bold;
        }

      `}</style>

    </div>
  );
}
