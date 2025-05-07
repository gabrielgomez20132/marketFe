import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const endpoint = `${import.meta.env.VITE_API_URL}/top-products`;

  useEffect(() => {
    axios.get(endpoint)
      .then(response => {
        setProductos(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al obtener los productos');
        setLoading(false);
      });
  }, [endpoint]);

  if (loading) return <p className="text-center mt-10 text-lg">Cargando productos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Top 20 de Celulares</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {productos.map(producto => {
          return (
            <div
              key={producto.id}
              className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition flex gap-4"
            >
              <img
                src={producto.thumbnail}
                alt={producto.name}
                className="w-32 h-32 object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Sin+Imagen';
                }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{producto.name}</h3>
                <p><span className="font-medium">Familia:</span> {producto.family_name}</p>
                {/* <p><span className="font-medium">Precio:</span> ${producto.price.toLocaleString('es-AR')} {producto.currency}</p>
                <p><span className="font-medium">Envío:</span> {producto.shipping ? '✔️ Envío gratis' : '❌ Sin envío'}</p>
                <a
                  href={producto.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-1 inline-block"
                >
                  Ver en MercadoLibre
                </a> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón de volver al inicio ubicado en la parte inferior */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          ⬅️ Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default ProductList;
