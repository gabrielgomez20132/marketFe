import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const RolesEdit = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [rol, setRol] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [permisoSeleccionado, setPermisoSeleccionado] = useState('');
  const [error, setError] = useState(null); // Para mostrar el mensaje de error si no se seleccionó permiso
  const navigate = useNavigate();

  const fetchRol = async () => {
    try {
      const endpoint = import.meta.env.VITE_API_URL_USER;
      const res = await axios.get(`${endpoint}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const found = res.data.find(r => r._id === id);
      setRol(found);
    } catch (error) {
      console.error('Error al cargar rol:', error);
    }
  };

  const fetchPermisos = async () => {
    try {
      const endpoint = import.meta.env.VITE_API_URL_USER;
      const res = await axios.get(`${endpoint}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermisos(res.data);
    } catch (error) {
      console.error('Error al cargar permisos:', error);
    }
  };

  const agregarPermiso = async () => {
    if (!permisoSeleccionado) {
      setError('Por favor, selecciona un permiso para agregar');
      return;
    }

    // Verificar si el permiso ya ha sido asignado
    if (rol.permissions?.some(p => p._id === permisoSeleccionado)) {
      setError('Este permiso ya ha sido asignado al rol');
      return;
    }

    setError(null); // Limpiar el error si se seleccionó un permiso válido
    try {
      const endpoint = import.meta.env.VITE_API_URL_USER;
      await axios.put(
        `${endpoint}/roles/${id}/add-permission`,
        { permissionId: permisoSeleccionado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRol(); // refrescar permisos
    } catch (error) {
      console.error('Error al agregar permiso:', error);
    }
  };

  useEffect(() => {
    fetchRol();
    fetchPermisos();
  }, [id]);

  if (!rol) return <p className="p-4">Cargando rol...</p>;

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Editar Rol: {rol.name}</h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Permisos actuales:</label>
        <ul className="list-disc list-inside text-sm">
          {rol.permissions?.map(p => (
            <li key={p._id}>{p.name}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Agregar nuevo permiso:</label>
        <select
          value={permisoSeleccionado}
          onChange={(e) => setPermisoSeleccionado(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Seleccione un permiso</option>
          {permisos
            .filter(p => !rol.permissions?.some(rp => rp._id === p._id)) // Filtrar permisos ya asignados
            .map(p => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Mostrar mensaje de error */}
      </div>

      <div className="flex gap-3">
        <button
          onClick={agregarPermiso}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Permiso
        </button>
        <button
          onClick={() => navigate('/admin/roles')}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default RolesEdit;
