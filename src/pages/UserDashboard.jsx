import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="user-dashboard">
      <h1>Bienvenido, {user?.name || user?.username}</h1>
      <p>Aquí podrás editar tus datos y realizar compras.</p>

      {/* Agregar funcionalidades de edición y compra según tus necesidades */}
      <div className="edit-section">
        <h2>Editar Datos</h2>
        <form>
          {/* Campos para editar datos del usuario */}
          <input type="text" placeholder="Nombre" defaultValue={user?.name} />
          <input type="email" placeholder="Email" defaultValue={user?.email} />
          <button type="submit">Actualizar</button>
        </form>
      </div>

      {/* Aquí puedes agregar otras secciones como la compra, etc. */}
    </div>
  );
};

export default UserDashboard;
