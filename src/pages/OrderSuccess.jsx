import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    if (!order) {
      navigate('/'); // Si no hay orden, redirigir al inicio
    } else {
      clearCart(); // Limpiar el carrito cuando se haya creado la orden
    }
  }, [order, navigate, clearCart]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-green-600">¡Orden Confirmada!</h2>

      {order ? (
        <div className="mt-10 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Detalles de la Orden</h3>
            <p className="mt-2 text-gray-700">Gracias por tu compra, tu orden ha sido procesada con éxito.</p>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800">Número de Orden: {order._id}</h4>
              <p className="text-gray-700">Total: ${order.total}</p>
              <p className="text-gray-700">Método de Pago: {order.paymentMethod}</p>
              {order.coupon && (
                <p className="text-gray-700">
                  Descuento Aplicado: {order.coupon.discount}% con el cupón "{order.coupon.code}"
                </p>
              )}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800">Productos Comprados:</h4>
              <ul className="space-y-4">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-md" />
                      <div>
                        <p className="text-gray-800 font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800">Dirección de Envío</h4>
              <p className="text-gray-700">{order.shippingAddress}</p>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Seguir Comprando
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition"
              >
                Ver Mis Órdenes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-6">Cargando los detalles de la orden...</p>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
