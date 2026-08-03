import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Audience from './pages/Audience';
import Settings from './pages/Settings';
import Content from './pages/Content';
import Team from './pages/Team';
import Forbidden from './pages/Forbidden';
import MemberDashboard from './pages/MemberDashboard';
import { AuthProvider } from './context/AuthContext';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />

          {/* Protected Dashboard Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="content"
              element={
                <RoleBasedRoute allowedRoles={['creator']}>
                  <Content />
                </RoleBasedRoute>
              }
            />
            <Route path="audience" element={<Audience />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="team"
              element={
                <RoleBasedRoute allowedRoles={['creator']}>
                  <Team />
                </RoleBasedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


