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

import AudienceAnalytics from "./pages/AudienceAnalytics";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import CreatorContent from "./pages/CreatorContent";
import CreatorEarnings from "./pages/CreatorEarnings";
import CreatorCampaigns from "./pages/CreatorCampaigns";
import CreatorProfile from "./pages/CreatorProfile";
import CreatorSettings from "./pages/CreatorSettings";

import BrandAnalytics from "./pages/BrandAnalytics";
import BrandCampaigns from "./pages/BrandCampaigns";
import BrandCreators from "./pages/BrandCreators";
import BrandProfile from "./pages/BrandProfile";
import BrandSettings from "./pages/BrandSettings";

import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


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

        <Route
          path="/creator/analytics"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <CreatorAnalytics />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator/content"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <CreatorContent />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator/audience"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <AudienceAnalytics />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator/earnings"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <CreatorEarnings />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator/campaigns"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <CreatorCampaigns />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator/profile"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <CreatorProfile />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator/settings"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <CreatorSettings />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator/notifications"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Creator"]}>
                <Notifications />
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

        <Route
          path="/brand/campaigns"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Brand", "Brand Agency"]}>
                <BrandCampaigns />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/creators"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Brand", "Brand Agency"]}>
                <BrandCreators />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/analytics"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Brand", "Brand Agency"]}>
                <BrandAnalytics />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/profile"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Brand", "Brand Agency"]}>
                <BrandProfile />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/settings"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Brand", "Brand Agency"]}>
                <BrandSettings />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/notifications"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={["Brand", "Brand Agency"]}>
                <Notifications />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />


        {/* FALLBACKS */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
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