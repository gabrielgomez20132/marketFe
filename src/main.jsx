import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <WishlistProvider> {/* WishlistProvider debe estar encima de AuthProvider */}
        <CartProvider>
          <AuthProvider>
              <App />
          </AuthProvider>
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  </React.StrictMode>
);