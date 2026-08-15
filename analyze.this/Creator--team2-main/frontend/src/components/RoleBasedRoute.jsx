import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function RoleBasedRoute({ allowedRoles = [], children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children || null;
}
