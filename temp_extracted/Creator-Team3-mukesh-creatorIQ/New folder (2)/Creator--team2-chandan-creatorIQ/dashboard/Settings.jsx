import React, { useState } from "react";
import { Moon, Bell, Lock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    alert("Logged Out Successfully");
    navigate("/login");
  };

  const changePassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Settings
        </h1>

        {/* Notifications */}

        <div className="flex justify-between items-center border-b py-5">

          <div className="flex items-center gap-3">
            <Bell className="text-blue-600" />
            <span className="font-medium">
              Notifications
            </span>
          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={() =>
              setNotifications(!notifications)
            }
          />

        </div>

        {/* Dark Mode */}

        <div className="flex justify-between items-center border-b py-5">

          <div className="flex items-center gap-3">
            <Moon className="text-purple-600" />
            <span className="font-medium">
              Dark Mode
            </span>
          </div>

          <input
            type="checkbox"
            checked={darkMode}
            onChange={() =>
              setDarkMode(!darkMode)
            }
          />

        </div>

        {/* Change Password */}

        <div className="border-b py-5">

          <button
            onClick={changePassword}
            className="flex items-center gap-3 text-blue-700 font-semibold"
          >
            <Lock />
            Change Password
          </button>

        </div>

        {/* Logout */}

        <div className="pt-8">

          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl p-4 flex justify-center items-center gap-3"
          >
            <LogOut />
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;