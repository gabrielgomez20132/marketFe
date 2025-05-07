// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import UserDashboard from './pages/UserDashboard';
import UserOrders from './pages/UserOrders';
import Header from './components/Header';
import Footer from './components/Footer';
import Wishlist from './pages/Wishlist';
import TopProductos from './pages/MercadolibreTopProducts';
import { AuthContext } from './context/AuthContext';

import AdminLayout from './layouts/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import Productos from './pages/admin/Productos';
import ProductoCreate from './pages/admin/ProductoCreate';
import ProductoEdit from './pages/admin/ProductoEdit';
import Usuarios from './pages/admin/Usuarios';
import ProtectedRoute from './components/ProtectedRoute';
import CartList from './pages/CartList';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Categorias from './pages/admin/Categorias';
import CategoriaCreate from './pages/admin/CategoriaCreate';
import CategoriaEdit from './pages/admin/CategoriaEdit';
import UsuarioCreate from './pages/admin/UsuarioCreate';
import UsuarioEdit from './pages/admin/UsuarioEdit';
import Register from './pages/Register';
import Roles from './pages/admin/Roles';
import RolesEdit from './pages/admin/RolesEdit';
import RoleCreate from './pages/admin/RoleCreate';

function App() {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  const isAuthPage = ['/login', '/register'].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cartlist" element={<CartList />} />
          <Route path="/topProducts" element={<TopProductos />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route
            path="/user-profile"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-orders"
            element={
              <ProtectedRoute role="user">
                <UserOrders />
              </ProtectedRoute>
            }
          />
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
            <Route path="usuarios/nuevo" element={<UsuarioCreate />} />
            <Route path="usuarios/editar/:id" element={<UsuarioEdit />} />

            <Route path="roles" element={<Roles />} />
            <Route path="roles/editar/:id" element={<RolesEdit />} />
            <Route path="roles/nuevo" element={<RoleCreate />} />

            

            <Route path="categorias" element={<Categorias />} />
            <Route path="categorias/editar/:id" element={<CategoriaEdit />} />
            <Route path="categorias/nuevo" element={<CategoriaCreate />} />
            
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
