import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    username: '',
    nombre: '',
    apellido: '',
    dni: '',
    direccion: '',
    codigo_postal: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
        console.error('Error en el registro:', error);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error al registrarte. Verifica los datos.';
        toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <ToastContainer />

      {/* <div className="mb-8">
        <Link to="/" className="text-3xl font-bold text-blue-700">
          MarketApp
        </Link>
      </div> */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6 mt-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Crear cuenta</h2>

        <div className="space-y-4">
          {['username', 'nombre', 'apellido', 'dni', 'direccion', 'codigo_postal', 'email', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Registrarse
        </button>

        <div className="text-center mt-4">
          <span className="text-gray-600">¿Ya tienes cuenta? </span>
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
