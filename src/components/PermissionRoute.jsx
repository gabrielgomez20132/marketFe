import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PermissionRoute = ({ permission, children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const hasPermission = () => {
    return user?.role?.permissions?.some((p) => p.name === permission);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasPermission()) {
    return <div className="p-6 text-center text-red-600 text-xl font-semibold">No estás autorizado</div>;
  }

  return children;
};

export default PermissionRoute;
