import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CreatorDashboard from "./pages/CreatorDashboard";
import BrandDashboard from "./pages/BrandDashboard";


// ===============================
// PROTECTED ROUTE
// ===============================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


// ===============================
// ROLE PROTECTED ROUTE
// ===============================
function RoleProtectedRoute({
  allowedRoles,
  children,
}) {
  const role = (
    localStorage.getItem("role") || ""
  )
    .toLowerCase()
    .trim();

  const allowed = allowedRoles.some(
    (allowedRole) =>
      allowedRole.toLowerCase().trim() === role
  );

  if (!allowed) {
    if (role === "creator") {
      return (
        <Navigate
          to="/creator"
          replace
        />
      );
    }

    if (
      role === "brand" ||
      role === "brand agency"
    ) {
      return (
        <Navigate
          to="/brand"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};


// ===============================
// APP
// ===============================
export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  return (
    <BrowserRouter>

      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to={
                  (
                    localStorage.getItem("role") || ""
                  )
                    .toLowerCase()
                    .trim() === "creator"
                    ? "/creator"
                    : "/brand"
                }
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              setToken={setToken}
            />
          }
        />


        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* CREATOR DASHBOARD */}
        <Route
          path="/creator"
          element={
            <ProtectedRoute>

              <RoleProtectedRoute
                allowedRoles={[
                  "Creator",
                ]}
              >

                <CreatorDashboard />

              </RoleProtectedRoute>

            </ProtectedRoute>
          }
        />


        {/* BRAND DASHBOARD */}
        <Route
          path="/brand"
          element={
            <ProtectedRoute>

              <RoleProtectedRoute
                allowedRoles={[
                  "Brand",
                  "Brand Agency",
                ]}
              >

                <BrandDashboard />

              </RoleProtectedRoute>

            </ProtectedRoute>
          }
        />


        {/* UNKNOWN ROUTE */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}