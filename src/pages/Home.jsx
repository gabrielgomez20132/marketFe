import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import product01 from '../assets/img/product01.png';
import product02 from '../assets/img/product02.png';
import product03 from '../assets/img/product03.png';

const categories = [
  { name: 'Laptops', image: product01 },
  { name: 'Auriculares', image: product02 },
  { name: 'Cámaras', image: product03 },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products?page=${currentPage}`);
        const data = response.data;

         // Accedé correctamente al array de productos
        const productList = data?.data?.data || [];
        const pages = data?.data?.total_pages || 1;

        setProducts(productList); // evita error si no viene
        setTotalPages(pages);
        
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const addToWishlist = (product) => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!storedWishlist.some(item => item._id === product._id)) {
      storedWishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
    }
  };

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!storedCart.some(item => item._id === product._id)) {
      storedCart.push({ ...product, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(storedCart));
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Hero */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido al Marketplace</h1>
        <p className="text-lg">Los mejores productos de electrónica en un solo lugar</p>
      </section>

      {/* NAVIGATION */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <ul className="flex flex-wrap justify-center space-x-4 py-4 text-gray-700 font-semibold text-sm sm:text-base">
              <li><Link to="/topProducts" className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Top Smartphones</Link></li>
              <li><Link to="/categories/notebooks" className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Laptops</Link></li>
              <li><Link to="/categories/celulares" className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Smartphones</Link></li>
              <li><Link to="/categories/cámaras" className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Cámaras</Link></li>
              <li><Link to="/categories/accessories" className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1">Accesorios</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Listado de productos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Productos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-2xl hover:shadow-2xl transition-all ease-in-out relative group"
              >
                <img
                  src={product.image || product01}
                  alt={product.name}
                  className="w-full h-56 object-contain p-4 rounded-t-lg"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-opacity-20 backdrop-blur-sm p-4">
                  <div className="flex gap-3">
                    <Tippy content="Agregar a favoritos" animation="scale">
                      <button
                        onClick={() => addToWishlist(product)}
                        className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition transform active:scale-95 duration-150"
                      >
                        <i className="fas fa-heart text-gray-700"></i>
                      </button>
                    </Tippy>

                    <Tippy content="Agregar al carrito" animation="scale">
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition transform active:scale-95 duration-150"
                      >
                        <i className="fas fa-shopping-cart text-gray-700"></i>
                      </button>
                    </Tippy>

                    <Tippy content="Vista rápida" animation="scale">
                      <button className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition transform active:scale-95 duration-150">
                        <i className="fas fa-eye text-gray-700"></i>
                      </button>
                    </Tippy>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-600 font-bold text-xl">${product.price}</span>
                  </div>
                  <span className="mt-2 inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
                    ⭐ {product.rating} / 5
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación con Anterior y Siguiente */}
          <div className="flex justify-center mt-8 space-x-2 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              ← Anterior
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Categorías</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-32 h-32 mx-auto object-contain mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-700">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
