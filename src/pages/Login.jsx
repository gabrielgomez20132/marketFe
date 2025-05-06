import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  // Verifica si el usuario ya está autenticado, si es así, redirige a '/' (Home)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirige si ya está logueado
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) {
      navigate('/admin'); // Redirige al panel de administración si el login es exitoso
    } else {
      toast.error('Credenciales Invalidas');
    }
  };

  // Función para manejar el login con Google (ajustar con tu método)
  const handleGoogleLogin = (response) => {
    console.log(response);
    // Aquí debes agregar la lógica para manejar el login con Google
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
       <ToastContainer />
      {/* Botón para volver al inicio */}
      <div className="mb-8">
        <Link to="/" className="text-3xl font-bold text-blue-700">
          MarketApp
        </Link>
      </div>

      {/* Formulario de login */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6 mt-10"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>

        <div className="space-y-4">
          {/* Campo Email */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Campo Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Botón de Iniciar Sesión */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Iniciar sesión
        </button>

        <div className="text-center mt-4">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Regístrate
          </Link>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
