import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoriaCreate = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const endpoint = import.meta.env.VITE_API_URL;

  const validationSchema = Yup.object({
    name: Yup.string().required('Campo obligatorio'),
    description: Yup.string().required('Campo obligatorio'),
  });

  const handleSubmit = async (values) => {
    console.log('Valores que se enviarán:', values);
    setLoading(true);
    try {
      const res = await axios.post(`${endpoint}/categories`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 201) {
        toast.success('Categoría creada correctamente');
        setTimeout(() => navigate('/admin/categorias'), 2000);
      } else {
        toast.info('Categoría actualizada');
        setTimeout(() => navigate('/admin/categorias'), 2000);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Error al crear la categoría');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-10">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <ToastContainer />
        <h2 className="text-2xl font-semibold text-center mb-4">Crear Categoría</h2>

        <Formik
          initialValues={{
            name: '',
            description: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            {[['name', 'Nombre de la Categoría'], ['description', 'Descripción']].map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-medium">{label}</label>
                <Field name={field} type="text" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
              </div>
            ))}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                {loading ? 'Creando...' : 'Crear Categoría'}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CategoriaCreate;
