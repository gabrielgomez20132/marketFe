// src/context/WishlistContext.js
import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // ✅ Cargar wishlist desde localStorage en el primer render
  const [wishlist, setWishlist] = useState(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error('Error cargando wishlist desde localStorage', error);
      return [];
    }
  });

  // ✅ Guardar wishlist en localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error guardando wishlist en localStorage', error);
    }
  }, [wishlist]);

  // Agregar producto a la wishlist
  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (!prev.some(item => item._id === product._id)) {
        return [...prev, product];
      }
      return prev; // No lo duplica
    });
  };

  // Eliminar producto de la wishlist
  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };

  // Verificar si un producto está en la wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      wishlistCount: wishlist.length, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
