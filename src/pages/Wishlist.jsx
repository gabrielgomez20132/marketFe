import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';

const Wishlist = () => {
  console.log("Wishlist renderizado");
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col"> {/* min-h-screen y flex para asegurar que el contenido llene la pantalla */}
      <section className="py-16 bg-white flex-grow"> {/* flex-grow permite que esta sección crezca para llenar el espacio restante */}
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Mi Wishlist</h2>

          {wishlist.length === 0 ? (
            <p className="text-center text-gray-600">Tu wishlist está vacío</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-2xl p-4">
                  <img src={product.image || '/default-image.png'} alt={product.name} className="w-full h-56 object-contain p-4 rounded-t-lg" />
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-600 font-bold text-xl">${product.price}</span>
                  </div>
                  <button onClick={() => removeFromWishlist(product._id)} className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Link to="/" className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              Volver a la tienda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
