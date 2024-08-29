import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

function ProtectedRoute({ element, ...rest }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/signin" />;
}

export default ProtectedRoute;

