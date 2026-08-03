import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = userRole.toLowerCase().trim();
  const allowed = allowedRoles.map((role) => role.toLowerCase().trim());

  if (!allowed.includes(currentRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
