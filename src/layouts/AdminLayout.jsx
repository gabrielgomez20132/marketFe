// src/layouts/AdminLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Panel Admin</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/productos" className="hover:bg-gray-700 p-2 rounded">Productos</Link>
          <Link to="/admin/usuarios" className="hover:bg-gray-700 p-2 rounded">Usuarios</Link>
          <Link to="/admin/categorias" className="hover:bg-gray-700 p-2 rounded">Categorías</Link>
          {/* Agrega más links aquí */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
