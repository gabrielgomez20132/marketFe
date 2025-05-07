import React, { useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';

const CategoriaDelete = ({ categoryId, onDelete }) => {
  const { token } = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      const endpoint = import.meta.env.VITE_API_URL_USER;

      const response = await axios.patch(`${endpoint}/categories/${categoryId}`, { isActive: false }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Swal.fire('Eliminado!', 'La categoría ha sido eliminada.', 'success');
        onDelete(); // Refrescar lista
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar la categoría.', 'error');
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta categoría será eliminada permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  return (
    <button
      className="bg-red-500 text-white px-3 py-1 rounded"
      onClick={confirmDelete}
    >
      Eliminar
    </button>
  );
};

export default CategoriaDelete;
