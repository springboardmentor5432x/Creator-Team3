import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "creator",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");
  setLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: formData.username.trim(),
        Email: formData.email.trim(),
        phone: formData.phone.trim(),
        Password: formData.password,
        role: formData.role,
      }),
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }

    if (!response.ok) {
      throw new Error(
        data.detail || `Backend error: ${response.status}`
      );
    }

    setSuccess("Registration successful!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (error) {
    console.error("REAL REGISTER ERROR:", error);

    setError(
      error.message ||
      "Cannot connect to backend"
    );

  } finally {
    setLoading(false);
  }
};
  return (
    <div className="register-page">
      <div className="register-card">

        <h1>Create Account</h1>

        <p className="subtitle">
          Join CreatorIQ
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label htmlFor="username">
            Full Name
          </label>

          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="phone">
            Phone
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <div className="password-box">

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

            <button
              type="button"
              onClick={() => {
                setShowPassword((previous) => !previous);
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <label htmlFor="role">
            Account Type
          </label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="creator">
              Creator
            </option>

            <option value="brand agency">
              Brand / Agency
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="login-link">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: #020617;
        }

        .register-card {
          width: 100%;
          max-width: 450px;
          padding: 35px;
          border-radius: 18px;
          background: #111827;
          color: white;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }

        .register-card h1 {
          text-align: center;
          margin-bottom: 8px;
        }

        .subtitle {
          text-align: center;
          color: #94a3b8;
          margin-bottom: 25px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        label {
          color: #cbd5e1;
          font-size: 14px;
          margin-top: 8px;
        }

        input,
        select {
          width: 100%;
          padding: 13px;
          border-radius: 8px;
          border: 1px solid #334155;
          background: #1e293b;
          color: white;
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: #3b82f6;
        }

        .password-box {
          display: flex;
          gap: 8px;
        }

        .password-box input {
          flex: 1;
        }

        .password-box button {
          width: 70px;
          border: none;
          border-radius: 8px;
          background: #334155;
          color: white;
          cursor: pointer;
        }

        form > button {
          margin-top: 18px;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        form > button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          background: #450a0a;
          color: #fca5a5;
          text-align: center;
        }

        .success {
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          background: #064e3b;
          color: #6ee7b7;
          text-align: center;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          color: #94a3b8;
        }

        .login-link a {
          color: #60a5fa;
          text-decoration: none;
        }
      `}</style>

    </div>
  );
}
