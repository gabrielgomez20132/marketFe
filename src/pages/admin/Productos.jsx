import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProductos = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:5000/api/products?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data, current_page, total_pages } = response.data.data;

      setProductos(data);
      setCurrentPage(current_page);
      setTotalPages(total_pages);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Productos</h2>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Descripción</th>
                <th className="border border-gray-300 p-2 text-left">Categoria</th>
                <th className="border border-gray-300 p-2 text-left">Precio</th>
                <th className="border border-gray-300 p-2 text-left">Stock</th>
                <th className="border border-gray-300 p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td className="border border-gray-300 p-2">{producto.description}</td>
                  <td className="border border-gray-300 p-2">{producto.category.name[0].toLocaleUpperCase() + producto.category.name.slice(1).toLocaleLowerCase()}</td>
                  <td className="border border-gray-300 p-2">${producto.price}</td>
                  <td className="border border-gray-300 p-2">{producto.stock}</td>
                  <td className="border border-gray-300 p-2">
                    {/* Botones de acciones acá si querés */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Productos;
