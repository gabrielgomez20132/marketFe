import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductoEdit = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useContext(AuthContext);
  const endpoint = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams(); // Para obtener el ID del producto a editar

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${endpoint}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${endpoint}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data); // Establece los datos del producto en el estado
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id, token]);

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio').min(3, 'El nombre debe tener al menos 3 caracteres'),
    description: Yup.string().required('La descripción es obligatoria'),
    price: Yup.number().required('El precio es obligatorio').min(0.01, 'El precio debe ser mayor que 0'),
    salePrice: Yup.number().nullable().notRequired().test(
      'is-lower-than-price',
      'El precio con descuento no puede ser mayor que el precio regular',
      function (value) {
        const { price } = this.parent;
        return value === null || value <= price;
      }
    ),
    stock: Yup.number().required('El stock es obligatorio').min(0, 'El stock no puede ser negativo'),
    category: Yup.string().required('La categoría es obligatoria'),
    image: Yup.string().nullable().notRequired(),
    brand: Yup.string().nullable().notRequired(),
    isActive: Yup.boolean(),
    rating: Yup.number().min(0).max(5).nullable().notRequired(),
    tags: Yup.string().nullable().notRequired(),
    sku: Yup.string().required('El SKU es obligatorio').min(3, 'El SKU debe tener al menos 3 caracteres'),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');

    const payload = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      salePrice: values.salePrice ? parseFloat(values.salePrice) : null,
      stock: parseInt(values.stock),
      category: values.category,
      image: values.image,
      brand: values.brand,
      isActive: values.isActive,
      rating: values.rating ? parseFloat(values.rating) : null,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
      sku: values.sku,
    };

    try {
      const response = await axios.put(`${endpoint}/products/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Producto actualizado exitosamente');
        setTimeout(() => navigate('/admin/productos'), 2000);
      } else if (response.status === 400) {
        toast.error('Solicitud incorrecta. Verifique los datos');
      } else if (response.status === 500) {
        toast.error('Error interno del servidor. Intente nuevamente');
      } else {
        toast.error('Error inesperado. Intente nuevamente');
      }
    } catch (error) {
      if (error.response && error.response.data.message.includes('ya está en uso')) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al actualizar el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div>Cargando...</div>;
  }

  const prod = product.data;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <ToastContainer />
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Editar Producto</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <Formik
          initialValues={{
            name: prod.name,
            description: prod.description,
            price: prod.price,
            salePrice: prod.salePrice || '',
            stock: prod.stock,
            category: prod.category ? prod.category._id : null,
            image: prod.image || '',
            brand: prod.brand || '',
            rating: prod.rating || 0,
            tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : [],
            isActive: prod.isActive,
            sku: prod.sku,
          }}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">

              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <Field name="name" type="text" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="name" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Descripción</label>
                <Field name="description" as="textarea" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="description" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Precio</label>
                <Field name="price" type="number" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="price" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Precio con Descuento</label>
                <Field name="salePrice" type="number" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="salePrice" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Stock</label>
                <Field name="stock" type="number" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="stock" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Categoría</label>
                <Field as="select" name="category" className="mt-1 px-3 py-2 border rounded w-full">
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Imagen (URL o base64)</label>
                <Field name="image" type="text" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="image" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Marca</label>
                <Field name="brand" type="text" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="brand" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">SKU</label>
                <Field name="sku" type="text" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="sku" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Calificación(1-5)</label>
                <Field name="rating" type="number" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="rating" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">Tags (separados por coma)</label>
                <Field name="tags" type="text" className="mt-1 px-3 py-2 border rounded w-full" />
                <ErrorMessage name="tags" component="div" className="text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  <Field type="checkbox" name="isActive" className="mr-2" />
                  Producto habilitado ?
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 w-full"
                >
                  {loading ? 'Actualizando...' : 'Actualizar Producto'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductoEdit;
