import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("creatorUser"));

    if (!user) {
      alert("No registered user found.");
      return;
    }

    if (email !== user.email) {
      alert("Email not found.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    user.password = newPassword;

    localStorage.setItem("creatorUser", JSON.stringify(user));

    alert("Password Updated Successfully");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-700">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-8">
          Reset Password
        </h1>

        <form onSubmit={handleReset} className="space-y-5">

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400"/>
            <input
              type="email"
              placeholder="Registered Email"
              className="w-full border rounded-xl pl-10 p-3"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400"/>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded-xl pl-10 p-3"
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400"/>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded-xl pl-10 p-3"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-xl p-3"
          >
            Reset Password
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-blue-700 text-blue-700 rounded-xl p-3"
          >
            Back to Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;