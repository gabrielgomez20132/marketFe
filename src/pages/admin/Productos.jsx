import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import ProductoDelete from './ProductoDelete'; // Importamos ProductoDelete

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProductos = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = import.meta.env.VITE_API_URL;

      const response = await axios.get(`${endpoint}/products?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = response.data.data;

      setProductos(resData.data); // <--- productos está dentro de "data"
      setCurrentPage(resData.current_page);
      setTotalPages(resData.total_pages);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Nombre',
        accessorKey: 'name',
      },
      {
        header: 'Descripción',
        accessorKey: 'description',
      },
      {
        header: 'Categoría',
        accessorKey: 'category.name',
        cell: info => {
          const value = info.getValue();
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        },
      },
      {
        header: 'Precio',
        accessorKey: 'price',
        cell: info => `$${info.getValue()}`,
      },
      {
        header: 'Stock',
        accessorKey: 'stock',
      },
      {
        header: 'SKU',
        accessorKey: 'sku',
      },
      {
        header: 'Acciones',
        cell: ({ row }) => {
          const productId = row.original._id; // Obtén el id del producto desde la fila
          return (
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => navigate(`/admin/productos/editar/${productId}`)} // Redirigir a la página de edición
              >
                Editar
              </button>
              <ProductoDelete 
                productId={productId} 
                onDelete={() => fetchProductos(currentPage)} // Llamamos a onDelete para refrescar la lista
              />
            </div>
          );
        },
      },
    ],
    [currentPage]
  );

  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow max-w-screen">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Gestión de Productos</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => navigate('/admin/productos/nuevo')}>
          + Nuevo
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-4 py-2 border text-left">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-2 border whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación responsive */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
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
