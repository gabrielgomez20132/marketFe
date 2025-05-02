import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
//import { GoogleLogin } from 'react-google-login'; // Si estás usando una librería de Google Login

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
      alert('Credenciales inválidas');
    }
  };

  // Función para manejar el login con Google (ajustar con tu método)
  const handleGoogleLogin = (response) => {
    console.log(response);
    // Aquí debes agregar la lógica para manejar el login con Google
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
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

        {/* Separador para opciones de login */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">O</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Botón de Iniciar sesión con Google */}
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center bg-red-300 text-gray-500 font-semibold py-2 rounded-md transition duration-200 cursor-not-allowed"
        >
          <svg
            className="g-icon h-5 w-5 mr-3"
            aria-hidden="true"
          >
            <use href="/static/prod/f/202504281115-7611864f2a/icons/sprite.svg#icon-logo-google"></use>
          </svg>
          Iniciar sesión con Google
        </button>
        {/* <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={(error) => console.log(error)}
          useOneTap // Opcional, para mostrar el inicio de sesión con un solo clic
          shape="rectangular"
          size="large"
          width="100%"
          text="signin_with"
          theme="outline"
        /> */}
        
      </form>
    </div>
  );
};

export default Login;
