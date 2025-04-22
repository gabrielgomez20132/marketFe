import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <p>Bienvenido al panel de administración.</p>

      {/* Agregar funcionalidades del panel de administración */}
      <div className="manage-section">
        <h2>Gestionar Usuarios</h2>
        <button>Ver todos los usuarios</button>
        <button>Crear nuevo usuario</button>
        {/* Aquí puedes agregar más opciones de administración */}
      </div>
    </div>
  );
};

export default AdminDashboard;
