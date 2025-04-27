// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import UserDashboard from './pages/UserDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Wishlist from './pages/Wishlist';
import TopProductos from './pages/MercadolibreTopProducts';
import { AuthContext } from './context/AuthContext';

// Layout Admin y páginas internas
import AdminLayout from './layouts/AdminLayout';
import AdminHome from './pages/admin/AdminHome'; // Bienvenida al admin

import Productos from './pages/admin/Productos';
import ProductoCreate from './pages/admin/ProductoCreate';
import ProductoEdit from './pages/admin/ProductoEdit';
import Usuarios from './pages/admin/Usuarios';

import ProtectedRoute from './components/ProtectedRoute'; // Importa el ProtectedRoute
import ProductoDelete from './pages/admin/ProductoDelete';

function App() {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // Spinner opcional

  // Verificación del rol del usuario
  const isLoginPage = location.pathname.startsWith('/login');

  return (
    <>
      {/* No mostrar Header y Footer en la página de login */}
      {!isLoginPage && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/topProducts" element={<TopProductos />} />

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
          <Route path="productos/nuevo" element={<ProductoCreate />} />
          <Route path="productos/editar/:id" element={<ProductoEdit />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

        {/* Ruta para 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </>
  );
}

export default App;
