import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isSignedIn: boolean;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isSignedIn, children }) => {
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default ProtectedRoute;
