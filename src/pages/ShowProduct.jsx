import React from 'react';

const ShowProduct = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-64 object-contain rounded-lg mb-4 border"
        />

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {product.name}
        </h2>

        <div className="space-y-3 text-gray-700 text-base px-1">
          <div>
            <span className="font-semibold text-gray-800">Marca:</span>{' '}
            {product.brand}
          </div>
          <div>
            <span className="font-semibold text-gray-800">Descripción:</span>{' '}
            {product.description}
          </div>
          <div>
            <span className="font-semibold text-gray-800">SKU:</span>{' '}
            {product.sku || 'N/A'}
          </div>
          <div className="text-xl font-bold text-green-600">
            Precio: ${product.price}
          </div>
        </div>

        {/* {product.rating && (
          <div className="mt-4 text-yellow-600 font-bold text-center">
            ⭐ {product.rating} / 5
          </div>
        )} */}

        {/* Info de tarjetas y cuotas */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Pagá en cuotas
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✔ 3 cuotas sin interés con Visa</li>
            <li>✔ 6 cuotas fijas con Mastercard</li>
            <li>✔ Hasta 12 cuotas con interés con todas las tarjetas</li>
          </ul>
          <div className="flex gap-4 mt-3 items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              alt="Visa"
              className="w-12 h-auto"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              alt="Mastercard"
              className="w-12 h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
