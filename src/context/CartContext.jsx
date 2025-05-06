// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Cargar carrito desde localStorage al iniciar
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // ✅ Guardar cambios del carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error guardando carrito en localStorage', error);
    }
  }, [cart]);

  // ✅ Cargar descuento desde localStorage al iniciar
  const [discount, setDiscount] = useState(() => {
    const storedDiscount = localStorage.getItem('discount');
    return storedDiscount ? JSON.parse(storedDiscount) : 0;
  });

  // ✅ Guardar descuento en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem('discount', JSON.stringify(discount));
    } catch (error) {
      console.error('Error guardando descuento en localStorage', error);
    }
  }, [discount]);

  // Aplicar descuento (porcentaje en decimal, ej: 0.1 = 10%)
  const applyDiscount = (percentage) => {
    setDiscount(percentage);
  };

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

  // Eliminar producto
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // Actualizar cantidad
  const updateQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Verificar si un producto ya está
  const isInCartList = (productId) => {
    return cart.some(item => item._id === productId);
  };

  // Contar total de ítems
  const cartCount = cart.reduce((total, product) => total + product.quantity, 0);

  // Limpiar carrito
  const clearCart = () => {
    setCart([]); // Limpiar el estado del carrito
    localStorage.removeItem('cart'); // Eliminar el carrito del localStorage
    setDiscount(0); // Restablecer el descuento
    localStorage.removeItem('discount'); // Eliminar el descuento de localStorage
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      isInCartList,
      discount,
      applyDiscount,
      setDiscount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
