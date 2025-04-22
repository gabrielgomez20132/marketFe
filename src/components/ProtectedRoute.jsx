import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminRoute = false }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si la ruta es para admin, pero el usuario no es admin, redirigir
  if (adminRoute && user?.role?.name !== 'admin') {
    return <Navigate to="/" />; // Redirigir al inicio o a alguna otra página
  }

  return children;
};

export default ProtectedRoute;
