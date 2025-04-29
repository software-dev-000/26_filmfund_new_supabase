import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface FilmmakerRouteProps {
  children: React.ReactNode;
}

const FilmmakerRoute: React.FC<FilmmakerRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.user_metadata.user_type !== 'filmmaker') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default FilmmakerRoute;