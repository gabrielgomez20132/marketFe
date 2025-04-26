// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setToken(token);
    }
  }, []);

  const login = async (credentials) => {
    const { token, user } = await loginUser(credentials);
    
    if (token && user) {
      console.log('User returned after login:', user); // Verificamos el objeto user después del login
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      setToken(token);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
