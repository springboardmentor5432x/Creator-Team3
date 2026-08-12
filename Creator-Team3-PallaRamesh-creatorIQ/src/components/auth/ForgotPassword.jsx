import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const handleResetPassword = async () => {
  setLoading(true);
  setMessage("");
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

if (!passwordRegex.test(newPassword)) {
  setLoading(false);
  setMessage(
    "Password must be at least 8 characters and contain uppercase, lowercase, number and special character."
  );
  return;
}
  try {
    const response = await fetch("http://127.0.0.1:8000/forgot-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        new_password: newPassword,
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);

    if (!response.ok) {
      throw new Error(data.detail || "Password reset failed");
    }

    setMessage(data.message);

setTimeout(() => {
  onBack();
}, 1500);
  } catch (err) {
    setMessage(err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-card">
      <div className="auth-header">
  <h2 className="auth-logo">Forgot Password</h2>
  <p className="auth-subtitle">
    Reset your CreatorIQ account password
  </p>
</div>
<div className="form-group">
  <label className="form-label">Email Address</label>
  <input
    type="email"
    className="form-input"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

<div className="form-group">
  <label className="form-label">New Password</label>

  <div style={{ position: "relative" }}>
    <input
      type={showNewPassword ? "text" : "password"}
      className="form-input"
      placeholder="Enter new password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />

    <span
      onClick={() => setShowNewPassword(!showNewPassword)}
      style={{
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#888",
      }}
    >
      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>
{message && (
  <div className="auth-message success">
    {message}
  </div>
)}
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "20px",
  }}
>
  <button
    type="button"
    className="auth-btn"
    onClick={handleResetPassword}
    disabled={loading}
    style={{ flex: 1 }}
  >
    {loading ? "Resetting..." : "Reset Password"}
  </button>

  <button
    type="button"
    className="auth-btn"
    onClick={onBack}
    style={{ flex: 1 }}
  >
    ← Back to Login
  </button>
</div>
    </div>
  );
}