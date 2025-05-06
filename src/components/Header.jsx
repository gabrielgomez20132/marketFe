import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { removeFromWishlist,wishlistCount } = useContext(WishlistContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const isAdmin = user?.role?.name === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full">
      {/* Top Header */}
      <div className="bg-gray-800 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto flex justify-between px-4">
          <ul className="flex gap-6">
            <li><i className="fa fa-phone mr-1"></i> +54-383428888</li>
            <li><i className="fa fa-envelope-o mr-1"></i> market@gmail.com</li>
            <li><i className="fa fa-map-marker mr-1"></i> Rivadavia 355</li>
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-700">MarketApp</Link>

          {/* Search - solo si NO es admin */}
          {/* {!isAdmin && (
            <form className="flex w-full max-w-md mx-6">
              <select className="border border-gray-300 rounded-l px-3 text-gray-600">
                <option>All Categories</option>
                <option>Category 01</option>
                <option>Category 02</option>
              </select>
              <input
                className="flex-1 border-t border-b border-gray-300 px-4 focus:outline-none"
                type="text"
                placeholder="Buscar productos..."
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
              >
                Buscar
              </button>
            </form>
          )} */}

          {/* Right Side */}
          <div className="flex items-center gap-4 text-sm text-gray-700 relative">
            {!isAdmin && (
              <>
                <Link to="/wishlist" className="relative">
                  <i className="fa-regular fa-heart text-xl"></i>
                  <span className="ml-1">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link to="/cartlist" className="relative">
                  <div className="relative flex items-center">
                    <i className="fa fa-shopping-cart text-xl"></i>
                    <span className="ml-1">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 font-medium focus:outline-none"
                >
                  &nbsp;&nbsp;&nbsp; Hola, <strong>{user?.username || user?.name}</strong> <i className="fa fa-caret-down ml-1"></i>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {!isAdmin && (
                      <>
                        <Link to="/user-profile" className="block px-4 py-2 hover:bg-gray-100" onClick={handleMenuClick}>Mi perfil</Link>
                        <Link to="/user-orders" className="block px-4 py-2 hover:bg-gray-100" onClick={handleMenuClick}>Mis compras</Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100" onClick={handleMenuClick}>Panel Administrador</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
              >
                Ingresar
              </Link>
            )}

            {/* Mobile Menu Icon */}
            <button className="md:hidden" onClick={() => alert('Abrir menú mobile')}>
              <i className="fa fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
