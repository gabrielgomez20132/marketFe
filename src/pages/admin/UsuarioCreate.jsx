import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsuarioCreate = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const endpoint = import.meta.env.VITE_API_URL_USER;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${endpoint}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filtrar solo admin y user
        //const filtered = res.data.filter(r => ['admin', 'user'].includes(r.name));
        setRoles(res.data);
      } catch (err) {
        toast.error('Error al cargar roles');
      }
    };

    fetchRoles();
  }, [token]);

  const validationSchema = Yup.object({
    username: Yup.string().required('Campo obligatorio'),
    nombre: Yup.string().required('Campo obligatorio'),
    apellido: Yup.string().required('Campo obligatorio'),
    dni: Yup.string().required('Campo obligatorio'),
    direccion: Yup.string().required('Campo obligatorio'),
    codigo_postal: Yup.string().required('Campo obligatorio'),
    email: Yup.string().email('Formato inválido').required('Campo obligatorio'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Campo obligatorio'),
    role: Yup.string().required('Debe seleccionar un rol'),
  });

  const handleSubmit = async (values) => {
    console.log('Valores que se enviarán:', values);
    setLoading(true);
    try {
      const res = await axios.post(`${endpoint}/users`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 201) {
        toast.success('Usuario creado correctamente');
        setTimeout(() => navigate('/admin/usuarios'), 2000);
      } else {
        toast.info('Usuario actualizado');
        setTimeout(() => navigate('/admin/usuarios'), 2000);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Error al crear el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e, setFieldValue) => {
    const roleId = e.target.value;
    const role = roles.find(r => r._id === roleId);
    setFieldValue('role', roleId);
    setSelectedRole(role);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <ToastContainer />
        <h2 className="text-2xl font-semibold text-center mb-4">Crear Usuario</h2>

        <Formik
          initialValues={{
            username: '',
            nombre: '',
            apellido: '',
            dni: '',
            direccion: '',
            codigo_postal: '',
            email: '',
            password: '',
            role: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              {[
                ['username', 'Nombre de Usuario'],
                ['nombre', 'Nombre'],
                ['apellido', 'Apellido'],
                ['dni', 'DNI'],
                ['direccion', 'Dirección'],
                ['codigo_postal', 'Código Postal'],
                ['email', 'Correo Electrónico'],
                ['password', 'Contraseña'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium">{label}</label>
                  <Field name={field} type={field === 'password' ? 'password' : 'text'} className="mt-1 px-3 py-2 border rounded w-full" />
                  <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium">Rol</label>
                <Field as="select" name="role" className="mt-1 px-3 py-2 border rounded w-full" onChange={(e) => handleRoleChange(e, setFieldValue)}>
                  <option value="">Seleccione un rol</option>
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
              </div>

              {selectedRole && (
                <div className="bg-gray-50 border p-3 rounded mt-3">
                  <p className="font-semibold">Permisos del rol <span className="text-blue-600">{selectedRole.name}</span>:</p>
                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-700">
                    {selectedRole.permissions.map(p => (
                      <li key={p._id}>{p.description}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UsuarioCreate;
