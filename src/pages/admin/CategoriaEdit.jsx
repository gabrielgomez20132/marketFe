import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoriaEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const endpoint = import.meta.env.VITE_API_URL;

  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(false);

  // Traer los datos de la categoría
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`${endpoint}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        setCategoria(response.data);
      } catch (error) {
        console.error('Error al obtener categoría:', error);
        toast.error('Error al cargar los datos de la categoría');
      }
    };
    fetchCategoria();
  }, [id, token]);

  // Validación con Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
  });

  // Manejo del envío del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${endpoint}/categories/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Categoría actualizada exitosamente');
        setTimeout(() => navigate('/admin/categorias'), 2000);
      } else {
        toast.error('Error al actualizar la categoría');
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error inesperado';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!categoria) {
    return <div className="text-center mt-10">Cargando datos de la categoría...</div>;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg mt-24"> {/* Ajustamos el margen superior */}
        <ToastContainer />
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Editar Categoría</h2>

        <Formik
          initialValues={{
            name: categoria.name || '',
            description: categoria.description || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <Field
                  name="name"
                  type="text"
                  className="mt-1 px-3 py-2 border rounded w-full"
                />
                <ErrorMessage name="name" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Descripción</label>
                <Field
                  name="description"
                  type="text"
                  className="mt-1 px-3 py-2 border rounded w-full"
                />
                <ErrorMessage name="description" component="div" className="text-red-500" />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
                >
                  {loading ? 'Actualizando...' : 'Actualizar Categoría'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CategoriaEdit;
