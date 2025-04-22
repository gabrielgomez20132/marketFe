import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    console.log("Wishlist renderizado");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Cargar wishlist desde el localStorage
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    console.log("Wishlist cargado desde localStorage:", storedWishlist); // Esto te mostrará el estado inicial
    console.log(localStorage.getItem('wishlist'));
    setWishlist(storedWishlist);
  }, []);

  // Función para eliminar un producto del wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <div className="bg-gray-100">
      <section className="py-16 bg-white">
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
                    Eliminar del wishlist
                  </button>
                </div>
              ))}
            </div>
          )}
          <Link to="/" className="mt-8 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Volver a la tienda
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
