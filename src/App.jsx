// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import UserDashboard from './pages/UserDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Wishlist from './pages/Wishlist';
import { AuthContext } from './context/AuthContext';

// Layout Admin y páginas internas
import AdminLayout from './layouts/AdminLayout';
import AdminHome from './pages/admin/AdminHome'; // Bienvenida al admin
import Productos from './pages/admin/Productos';
import Usuarios from './pages/admin/Usuarios';

// Componente ProtectedRoute para proteger rutas
const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  
  console.log('User in ProtectedRoute:', user); // Verificamos el usuario

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role.name !== role) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  console.log('User in App:', user); // Verificamos el usuario aquí también

  // Verificación del rol del usuario
  const isLoginPage = location.pathname.startsWith('/login');
  const isAdmin = user?.role?.name === 'admin';
  const isUser = user?.role?.name === 'user';

  if (loading) return null; // Spinner opcional

  return (
    <>
      {/* No mostrar Header y Footer en la página de login */}
      {!isLoginPage && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Dashboard de usuario */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Panel Admin con rutas protegidas y layout lateral */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
