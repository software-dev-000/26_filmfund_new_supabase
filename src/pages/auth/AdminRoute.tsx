import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.user_metadata.user_type === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;