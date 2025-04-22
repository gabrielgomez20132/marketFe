import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem('token'); // Ajustá el nombre si usás otro
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">ID</th>
              <th className="border border-gray-300 p-2 text-left">Descripción</th>
              <th className="border border-gray-300 p-2 text-left">Precio</th>
              <th className="border border-gray-300 p-2 text-left">Stock</th>
              <th className="border border-gray-300 p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="border border-gray-300 p-2">{producto.id}</td>
                <td className="border border-gray-300 p-2">{producto.description}</td>
                <td className="border border-gray-300 p-2">${producto.price}</td>
                <td className="border border-gray-300 p-2">{producto.stock}</td>
                <td className="border border-gray-300 p-2">
                  {/* Acción de Editar */}
                  {/* <button
                    onClick={() => handleEdit(producto.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button> */}

                  {/* Acción de Eliminar */}
                  {/* <button
                    onClick={() => handleDelete(producto.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Eliminar
                  </button> */}

                  {/* Acción de Nuevo Producto */}
                  {/* <button
                    onClick={handleNewProduct}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Nuevo
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Productos;
