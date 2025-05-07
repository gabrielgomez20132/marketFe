import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const RoleCreate = () => {
  const { token } = useContext(AuthContext);
  const [permissions, setPermissions] = useState([]);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const endpoint = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${endpoint}/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermissions(res.data);
      } catch (error) {
        console.error('Error al obtener permisos:', error);
        setError('Error al cargar permisos');
      }
    };

    fetchPermissions();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionsChange = (e) => {
    const { value, checked } = e.target;
    setNewRole((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, value]
        : prev.permissions.filter((p) => p !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRole.name || !newRole.description || newRole.permissions.length === 0) {
      setError('Por favor, completa todos los campos y selecciona al menos un permiso');
      return;
    }

    try {
      const endpoint = import.meta.env.VITE_API_URL;
      await axios.post(
        `${endpoint}/roles`,
        {
          name: newRole.name,
          description: newRole.description,
          permissions: newRole.permissions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Limpia el formulario y redirige
      setNewRole({ name: '', description: '', permissions: [] });
      navigate('/admin/roles');
    } catch (error) {
      console.error('Error al crear el rol:', error);
      setError('Error al crear el rol');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Rol</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Nombre del Rol</label>
          <input
            type="text"
            name="name"
            value={newRole.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Descripción</label>
          <textarea
            name="description"
            value={newRole.description}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Seleccionar Permisos</label>
          <div className="grid grid-cols-2 gap-2">
            {permissions.map((permiso) => (
              <label key={permiso._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={permiso._id}
                  checked={newRole.permissions.includes(permiso._id)}
                  onChange={handlePermissionsChange}
                  className="mr-2"
                />
                {permiso.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear Rol
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/roles')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleCreate;
