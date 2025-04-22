import React, { useContext, useState } from "react";
import { CharacterContext } from "../context/CharacterContext";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import PilotoDelete from "../pages/PilotoDelete";

function DriverList() {
  const { drivers, loading } = useContext(CharacterContext);
  const [selectedId, setSelectedId] = useState(null);

  const handleCloseModal = () => {
    setSelectedId(null);
  };

  const handleDeleted = (id) => {
    //console.log("Piloto eliminado con ID:", id);
    setSelectedId(null); // Cerrar el modal después de eliminar
  };


  const formatDate = (dateString) => {
    if (!dateString) return "Desconocido";
    return moment(dateString).format("DD-MM-YYYY");
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🏎️ Listado de Pilotos F1
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-xl">
          <table className="min-w-full bg-white text-gray-800 border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-sm font-semibold text-white">
                <th className="px-6 py-4 text-center">Foto</th>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-center">Nacionalidad</th>
                <th className="px-6 py-4 text-center">Nacimiento</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-center">
                    <img
                      src={driver.image}
                      alt={driver.name}
                      className="w-20 h-20 object-cover rounded-lg mx-auto shadow-lg transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                  </td>
                  <td className="px-6 py-4">{driver.name}</td>
                  <td className="px-6 py-4 text-center">
                    {driver.nationality || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {formatDate(driver.dateOfBirth)}
                  </td>
                  <td className="px-6 py-12 flex justify-center gap-2">
                    <Link
                      to={`/pilotos/${driver.id}`}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1 rounded-full text-sm transition"
                    >
                      👁 Ver
                    </Link>
                    <Link
                      to={`/pilotos/${driver.id}/editar`}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-1 rounded-full text-sm transition"
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => setSelectedId(driver.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1 rounded-full text-sm transition"
                    >
                      🗑 Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedId && (
        <PilotoDelete id={selectedId} onDeleted={handleDeleted} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default DriverList;
