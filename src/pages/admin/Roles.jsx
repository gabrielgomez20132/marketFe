import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import RoleDelete from './RoleDelete';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const endpoint = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${endpoint}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Nombre Rol',
        accessorKey: 'name',
      },
      {
        header: 'Descripción',
        accessorKey: 'description',
      },
      {
        header: 'Permisos',
        cell: ({ row }) => {
          return row.original.permissions?.map(p => p.name).join(', ');
        },
      },
      {
        header: 'Acciones',
        cell: ({ row }) => {
          const roleId = row.original._id;
          return (
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => navigate(`/admin/roles/editar/${roleId}`)}
              >
                Editar
              </button>

                {/* Botón Eliminar: reemplazado por componente que usa SweetAlert */}
                <RoleDelete roleId={roleId} onDelete={fetchRoles} />
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow max-w-screen">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Gestión de Roles</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => navigate('/admin/roles/nuevo')}
        >
          + Nuevo
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando roles...</p>
      ) : (
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
      )}
    </div>
  );
};

export default Roles;
