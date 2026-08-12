import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "Creator",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: formData.username,
          Email: formData.email,
          phone: formData.phone,
          Password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background decoration */}
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      {/* Register Card */}
      <div className="auth-card register-card">

        {/* Header */}
        <div className="auth-header">

          <div className="auth-logo">
            <span>CI</span>
          </div>

          <h1>Create Account</h1>

          <p>
            Join CreatorIQ and start tracking your performance
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="auth-alert error-alert">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="auth-alert success-alert">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          {/* Username */}
          <div className="auth-field">

            <label htmlFor="username">
              Full Name
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your full name"
              value={formData.username}
              onChange={handleChange}
              required
            />

          </div>

          {/* Email */}
          <div className="auth-field">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Phone */}
          <div className="auth-field">

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* Password */}
          <div className="auth-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          {/* Role */}
          <div className="auth-field">

            <label htmlFor="role">
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="Creator">
                Creator
              </option>

              <option value="Brand Agency">
                Brand / Agency
              </option>

            </select>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"
            }

          </button>

        </form>

        {/* Footer */}
        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign In
          </Link>

        </div>

      </div>

      {/* CSS */}
      <style>{`

        /* =========================
           AUTH PAGE
        ========================= */

        .auth-page {
          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          position: relative;

          overflow-y: auto;

          padding: 40px 20px;

          background:
            radial-gradient(
              circle at top left,
              rgba(59, 130, 246, 0.12),
              transparent 35%
            ),

            radial-gradient(
              circle at bottom right,
              rgba(139, 92, 246, 0.12),
              transparent 35%
            ),

            #070b14;

          color: #ffffff;
        }

        /* =========================
           BACKGROUND GLOW
        ========================= */

        .auth-glow {
          position: absolute;

          width: 300px;
          height: 300px;

          border-radius: 50%;

          filter: blur(120px);

          opacity: 0.15;

          pointer-events: none;
        }

        .auth-glow-one {
          background: #3b82f6;

          top: 10%;
          left: 10%;
        }

        .auth-glow-two {
          background: #8b5cf6;

          right: 10%;
          bottom: 10%;
        }

        /* =========================
           CARD
        ========================= */

        .auth-card {

          width: 100%;

          max-width: 470px;

          position: relative;

          z-index: 2;

          padding: 38px;

          border-radius: 20px;

          background: rgba(17, 24, 39, 0.92);

          border: 1px solid rgba(255, 255, 255, 0.08);

          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.45),

            inset 0 1px 0
            rgba(255, 255, 255, 0.04);
        }

        /* =========================
           HEADER
        ========================= */

        .auth-header {

          text-align: center;

          margin-bottom: 28px;
        }

        .auth-logo {

          width: 58px;
          height: 58px;

          margin: 0 auto 18px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              #3b82f6,
              #8b5cf6
            );

          box-shadow:
            0 10px 30px
            rgba(59, 130, 246, 0.3);
        }

        .auth-logo span {

          font-size: 20px;

          font-weight: 800;

          letter-spacing: 1px;
        }

        .auth-header h1 {

          margin: 0 0 8px;

          font-size: 30px;

          font-weight: 800;
        }

        .auth-header p {

          margin: 0;

          color: #94a3b8;

          font-size: 14px;
        }

        /* =========================
           ALERTS
        ========================= */

        .auth-alert {

          padding: 12px 14px;

          margin-bottom: 20px;

          border-radius: 10px;

          font-size: 14px;

          text-align: center;
        }

        .error-alert {

          color: #fca5a5;

          background: rgba(239, 68, 68, 0.12);

          border: 1px solid
          rgba(239, 68, 68, 0.25);
        }

        .success-alert {

          color: #6ee7b7;

          background: rgba(16, 185, 129, 0.12);

          border: 1px solid
          rgba(16, 185, 129, 0.25);
        }

        /* =========================
           FORM
        ========================= */

        .auth-form {

          display: flex;

          flex-direction: column;

          gap: 17px;
        }

        .auth-field {

          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .auth-field label {

          font-size: 14px;

          font-weight: 600;

          color: #e2e8f0;
        }

        .auth-field input,
        .auth-field select {

          width: 100%;

          box-sizing: border-box;

          padding: 13px 14px;

          border-radius: 10px;

          border: 1px solid #263247;

          background: #0f172a;

          color: white;

          font-size: 14px;

          outline: none;

          transition: 0.2s;
        }

        .auth-field input::placeholder {

          color: #64748b;
        }

        .auth-field input:focus,
        .auth-field select:focus {

          border-color: #3b82f6;

          box-shadow:
            0 0 0 3px
            rgba(59, 130, 246, 0.12);
        }

        .auth-field select {

          cursor: pointer;
        }

        /* =========================
           PASSWORD
        ========================= */

        .password-wrapper {

          position: relative;
        }

        .password-wrapper input {

          padding-right: 48px;
        }

        .password-toggle {

          position: absolute;

          right: 12px;

          top: 50%;

          transform: translateY(-50%);

          border: none;

          background: transparent;

          cursor: pointer;

          font-size: 16px;
        }

        /* =========================
           BUTTON
        ========================= */

        .auth-submit {

          width: 100%;

          height: 48px;

          margin-top: 8px;

          border: none;

          border-radius: 10px;

          color: white;

          font-size: 15px;

          font-weight: 700;

          cursor: pointer;

          background:
            linear-gradient(
              135deg,
              #3b82f6,
              #6366f1
            );

          transition: 0.25s;
        }

        .auth-submit:hover {

          transform: translateY(-1px);

          box-shadow:
            0 10px 25px
            rgba(59, 130, 246, 0.25);
        }

        .auth-submit:disabled {

          opacity: 0.6;

          cursor: not-allowed;

          transform: none;
        }

        /* =========================
           FOOTER
        ========================= */

        .auth-footer {

          display: flex;

          justify-content: center;

          gap: 6px;

          margin-top: 24px;

          font-size: 14px;

          color: #94a3b8;
        }

        .auth-footer a {

          color: #60a5fa;

          font-weight: 600;

          text-decoration: none;
        }

        .auth-footer a:hover {

          color: #93c5fd;

          text-decoration: underline;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 600px) {

          .auth-card {

            padding: 28px 22px;
          }

          .auth-header h1 {

            font-size: 26px;
          }

        }

      `}</style>

    </div>
  );
}
