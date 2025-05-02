// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Cargar carrito desde localStorage al iniciar directamente en useState
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // ✅ Guardar cambios en carrito al localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error guardando carrito en localStorage', error);
    }
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item._id === product._id);
      if (existingProduct) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Verificar si producto está en el carrito
  const isInCartList = (productId) => {
    return cart.some(item => item._id === productId);
  };

  // Calcular el total de productos en el carrito
  const cartCount = cart.reduce((total, product) => total + product.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, isInCartList }}>
      {children}
    </CartContext.Provider>
  );
};
