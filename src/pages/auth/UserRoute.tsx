import React from 'react';
import { Navigate } from 'react-router-dom';

interface UserRouteProps {
  children: React.ReactNode;
}

const UserRoute: React.FC<UserRouteProps> = ({ children }) => {
  const isUser = localStorage.getItem('userAuth') === 'true';
  
  if (!isUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default UserRoute;