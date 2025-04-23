// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Nuevo estado para los datos del usuario
  const [token, setToken] = useState(null); // Nuevo estado para el token

  // Usamos un useEffect para recuperar los datos del localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser)); // Recuperamos el usuario de localStorage
      setToken(token); // Establecemos el token también
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para login
  const login = async (credentials) => {
    const { token, user } = await loginUser(credentials); // Supongamos que loginUser devuelve el token y el usuario
    
    if (token && user) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user)); // Guardamos los datos del usuario en localStorage
      setIsAuthenticated(true);
      setUser(user); // Actualizamos el estado del usuario
      setToken(token); // Guardamos el token en el estado
      return true; // Devuelvo true si fue exitoso
    }
    
    return false;
  };

  // Función para logout
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null); // Limpiamos el estado del usuario
    setToken(null); // Limpiamos el token
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



/* // src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Nuevo estado para los datos del usuario

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser)); // Recuperamos el usuario de localStorage
    }

  }, []); // Solo se ejecuta una vez al montar el componente

  const login = async (credentials) => {
    const { token, user } = await loginUser(credentials); // Supongamos que loginUser devuelve el token y el usuario
    
    if (token && user) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user)); // Guardamos los datos del usuario en localStorage
      setIsAuthenticated(true);
      setUser(user); // Actualizamos el estado del usuario
      return true; // Devuelvo true si fue exitoso
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null); // Limpiamos el estado del usuario
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 */