import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsuarioEdit = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const { token } = useContext(AuthContext);
  const endpoint = import.meta.env.VITE_API_URL_USER;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`${endpoint}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(response.data);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        toast.error('Error al cargar los datos del usuario');
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${endpoint}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = res.data.filter(r => ['admin', 'user'].includes(r.name));
        setRoles(filtered);
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    fetchUsuario();
    fetchRoles();
  }, [id, token]);

  const validationSchema = Yup.object({
    username: Yup.string().required('El nombre de usuario es obligatorio'),
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    dni: Yup.string().required('El DNI es obligatorio'),
    direccion: Yup.string().required('La dirección es obligatoria'),
    codigo_postal: Yup.string().required('El código postal es obligatorio'),
    email: Yup.string().email('Email inválido').required('El email es obligatorio'),
    role: Yup.string().required('El rol es obligatorio'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${endpoint}/users/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Usuario actualizado exitosamente');
        setTimeout(() => navigate('/admin/usuarios'), 2000);
      } else {
        toast.error('Error al actualizar el usuario');
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error inesperado';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return <div className="text-center mt-10">Cargando datos del usuario...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <ToastContainer />
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Editar Usuario</h2>

        <Formik
          initialValues={{
            username: usuario.username || '',
            nombre: usuario.nombre || '',
            apellido: usuario.apellido || '',
            dni: usuario.dni || '',
            direccion: usuario.direccion || '',
            codigo_postal: usuario.codigo_postal || '',
            email: usuario.email || '',
            role: usuario.role?._id || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              {[
                { name: 'username', label: 'Username', type: 'text' },
                { name: 'nombre', label: 'Nombre', type: 'text' },
                { name: 'apellido', label: 'Apellido', type: 'text' },
                { name: 'dni', label: 'DNI', type: 'text' },
                { name: 'direccion', label: 'Dirección', type: 'text' },
                { name: 'codigo_postal', label: 'Código Postal', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium">{label}</label>
                  <Field name={name} type={type} className="mt-1 px-3 py-2 border rounded w-full" />
                  <ErrorMessage name={name} component="div" className="text-red-500" />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium">Rol</label>
                <Field as="select" name="role" className="mt-1 px-3 py-2 border rounded w-full">
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol._id} value={rol._id}>
                      {rol.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500" />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
                >
                  {loading ? 'Actualizando...' : 'Actualizar Usuario'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UsuarioEdit;
