// pages/admin/Categorias.jsx
import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); 
  

  const fetchCategorias = async (page = 1) => {
    try {
      setLoading(true);
      
      const endpoint = import.meta.env.VITE_API_URL_USER;
      
      
      const response = await axios.get(`${endpoint}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      const resData = response;
      

      setCategorias(resData.data);
      setCurrentPage(resData.current_page);
      setTotalPages(resData.total_pages);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias(currentPage);
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
        header: 'Acciones',
        cell: ({ row }) => {
          const categoryId = row.original._id;
          return (
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => navigate(`/admin/categorias/editar/${categoryId}`)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const endpoint = import.meta.env.VITE_API_URL_USER;
                    await axios.delete(`${endpoint}/categories/${categoryId}`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    fetchCategorias(currentPage);
                  } catch (err) {
                    console.error('Error al eliminar categoría:', err);
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          );
        },
      },
    ],
    [currentPage]
  );

  const table = useReactTable({
    data: categorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow max-w-screen">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Gestión de Categorías</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => navigate('/admin/categorias/nueva')}
        >
          + Nueva
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando categorías...</p>
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

          
        </>
      )}
    </div>
  );
};

export default Categorias;
