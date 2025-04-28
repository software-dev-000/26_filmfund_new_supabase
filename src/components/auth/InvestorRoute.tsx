import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
interface InvestorRouteProps {
  children: React.ReactNode;
}

const InvestorRoute: React.FC<InvestorRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.user_metadata.user_type !== 'investor') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default InvestorRoute;