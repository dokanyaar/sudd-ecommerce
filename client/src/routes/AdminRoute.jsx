import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { userLoading, user } = useAuth();

  // Wait until authentication check finishes
  if (userLoading) {
    return <div>Loading...</div>;
  }

  // No logged-in user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but not an admin
  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Logged-in admin
  return children;
};

export default AdminRoute;
