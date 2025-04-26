// src/components/ProtectedRoute.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setIsReady(true);  // Una vez que los datos del usuario están listos, cambiamos el estado
    }
  }, [user, loading]);

  if (loading || !isReady) {
    return null;  // O un spinner mientras se cargan los datos del usuario
  }

  // Si el usuario no está autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no coincide con el rol esperado
  if (role && user.role.name.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza el contenido
  return children;
};

export default ProtectedRoute;
