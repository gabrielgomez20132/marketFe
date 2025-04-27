// ProductoDelete.js
import React, { useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/AuthContext';

const ProductoDelete = ({ productId, onDelete }) => {
    const { token } = useContext(AuthContext);
    
  const handleDelete = async () => {
    try {
      const endpoint = import.meta.env.VITE_API_URL_USER;

      const response = await axios.delete(`${endpoint}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
        onDelete(); // Llamamos a onDelete para refrescar la lista de productos
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Este producto será eliminado permanentemente!",
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

export default ProductoDelete;
