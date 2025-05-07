import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const { cart, discount, clearCart, setDiscount } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Si el usuario no está logueado, redirige a /login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Mientras se redirige, no renderizar nada
  if (!user) return null;

  const handleCheckout = async () => {
    const orderData = {
      user: user._id,
      items: cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod: 'credit_card',
      shippingAddress: user.direccion,
      coupon: discount > 0 ? { code: 'descuento10', discount: discount * 100 } : null,
    };

    setLoading(true);
    const endpoint = import.meta.env.VITE_API_URL_USER;

    try {
      const response = await axios.post(`${endpoint}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      clearCart();
      setDiscount(0);
      setLoading(false);

      toast.success('¡Compra realizada con éxito!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error al crear la orden:', error);
      setLoading(false);
      alert('Hubo un error al procesar tu orden.');
    }
  };

  const subtotal = cart.reduce((total, p) => total + p.price * p.quantity, 0);
  const discountAmount = subtotal * (discount || 0);
  const total = subtotal - discountAmount;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Resumen del Pedido</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Datos del Usuario</h3>
        <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
        <p><strong>DNI:</strong> {user.dni}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Dirección:</strong> {user.direccion}</p>
        <p><strong>Código Postal:</strong> {user.codigo_postal}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Productos</h3>
        <ul className="space-y-4">
          {cart.map((product) => (
            <li key={product._id} className="flex justify-between items-center border-b pb-2">
              <span>{product.name} x {product.quantity}</span>
              <span>${(product.price * product.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-right mt-4">
          <p className="text-lg font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
          {discountAmount > 0 && (
            <p className="text-green-600">Descuento: -${discountAmount.toFixed(2)}</p>
          )}
          <h3 className="text-2xl font-bold mt-2">Total: ${total.toFixed(2)}</h3>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate('/cartlist')}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition"
        >
          Volver al carrito
        </button>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
