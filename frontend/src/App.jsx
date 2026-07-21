import { useState } from "react";
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
import Notifications from "./pages/Notifications";

import CreatorProfile from "./pages/CreatorProfile";
import BrandProfile from "./pages/BrandProfile";

import CreatorSettings from "./pages/CreatorSettings";
import BrandSettings from "./pages/BrandSettings";

import RoleProtectedRoute from "./components/analytics/RoleProtectedRoute";


export default function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  return (
    <BrowserRouter>

      <Routes>

        {/* DEFAULT */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
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

        {/* ================= CREATOR ================= */}

        <Route
          path="/creator"
          element={
            <RoleProtectedRoute
              allowedRoles={["creator"]}
            >
              <CreatorDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/creator/audience"
          element={
            <RoleProtectedRoute
              allowedRoles={["creator"]}
            >
              <AudienceAnalytics />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/creator/profile"
          element={
            <RoleProtectedRoute
              allowedRoles={["creator"]}
            >
              <CreatorProfile />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/creator/settings"
          element={
            <RoleProtectedRoute
              allowedRoles={["creator"]}
            >
              <CreatorSettings />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/creator/notifications"
          element={
            <RoleProtectedRoute
              allowedRoles={["creator"]}
            >
              <Notifications />
            </RoleProtectedRoute>
          }
        />

        {/* ================= BRAND ================= */}

        <Route
          path="/brand"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "brand",
                "brand agency",
              ]}
            >
              <BrandDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/brand/profile"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "brand",
                "brand agency",
              ]}
            >
              <BrandProfile />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/brand/settings"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "brand",
                "brand agency",
              ]}
            >
              <BrandSettings />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/brand/notifications"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "brand",
                "brand agency",
              ]}
            >
              <Notifications />
            </RoleProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}