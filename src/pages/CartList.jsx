import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CartList = () => {
  const { cart, removeFromCart, updateQuantity, discount, applyDiscount } = useContext(CartContext);
  const { token } = useContext(AuthContext); 
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleApplyDiscount = () => {
    if (discountCode.trim().toLowerCase() === 'descuento10') {
      applyDiscount(0.1);
      setDiscountError('');
    } else {
      applyDiscount(0);
      setDiscountError('Código no válido');
    }
  };

  const subtotal = cart.reduce((total, product) => total + product.price * product.quantity, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const handleSaveCart = async () => {
    const cartData = {
      items: cart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      discount: discount,
    };

    try {
      const endpoint = import.meta.env.VITE_API_URL_USER;
      await axios.post(`${endpoint}/save-cart`, cartData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error guardando el carrito:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Carrito de Compras</h2>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-6">El carrito está vacío.</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            Seguir comprando
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((product) => (
              <div key={product._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-contain rounded-md" />
                  <div>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <span className="text-green-600 font-bold">${product.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value);
                      if (!isNaN(quantity) && quantity > 0) {
                        updateQuantity(product._id, quantity);
                      }
                    }}
                    className="w-16 p-2 text-center border rounded-md"
                    min="1"
                  />
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">¿Tienes un código de descuento?</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 p-2 border rounded-md"
                placeholder="Ingresa tu código"
              />
              <button
                onClick={handleApplyDiscount}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Aplicar
              </button>
            </div>
            {discountError && <p className="text-red-500 mt-2">{discountError}</p>}
            {discount > 0 && (
              <p className="text-green-600 mt-2 font-semibold">
                ¡Código aplicado! {discount * 100}% de descuento.
              </p>
            )}
          </div>

          <div className="mt-10 flex flex-col items-end space-y-4">
            <div className="text-right">
              <p className="text-gray-700">Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></p>
              {discount > 0 && (
                <p className="text-green-600">Descuento: -${discountAmount.toFixed(2)}</p>
              )}
              <h3 className="text-2xl font-bold mt-2">Total: ${total.toFixed(2)}</h3>
            </div>

            <div className="flex gap-4">
              <Link
                to="/"
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition"
              >
                Seguir comprando
              </Link>

              {/* <button
                onClick={handleSaveCart}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Guardar Carrito
              </button> */}
              
              <Link
                to="/checkout"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Iniciar pago
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartList;
