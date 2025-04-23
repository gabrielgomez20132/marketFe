import React, { useContext, useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Esquema de validación con Yup
const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
  apellido: yup.string().required('El apellido es obligatorio'),
  dni: yup.string().required('El DNI es obligatorio'),
  direccion: yup.string().required('La dirección es obligatoria'),
  codigo_postal: yup.string().required('El código postal es obligatorio'),
  username: yup.string().required('El nombre de usuario es obligatorio'),
  email: yup.string().email('Email inválido').required('El email es obligatorio')
});

const UserDashboard = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      dni: user?.dni || '',
      direccion: user?.direccion || '',
      codigo_postal: user?.codigo_postal || '',
      username: user?.username || '',
      email: user?.email || ''
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMsg({ type: '', text: '' });

    try {
      const API_URL = import.meta.env.VITE_API_URL_USER;
      const endpoint = `${API_URL}/users/${user._id}`;

      const response = await axios.put(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);           // Actualiza el contexto los datos del usuario
      reset(response.data);             // Actualiza los valores del formulario
      setServerMsg({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al actualizar el perfil';
      setServerMsg({ type: 'error', text: msg });
      console.error('Error del backend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Editar Perfil
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {[
              { label: 'Nombre', name: 'nombre' },
              { label: 'Apellido', name: 'apellido' },
              { label: 'DNI', name: 'dni' },
              { label: 'Dirección', name: 'direccion' },
              { label: 'Código Postal', name: 'codigo_postal' },
              { label: 'Nombre de Usuario', name: 'username' },
              { label: 'Email', name: 'email', type: 'email' }
            ].map(({ label, name, type = 'text' }) => (
              <Grid item xs={12} key={name}>
                <TextField
                  label={label}
                  type={type}
                  fullWidth
                  variant="outlined"
                  {...register(name)}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Stack spacing={2} direction="row">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar'}
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Volver
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>

        {serverMsg.text && (
          <Alert severity={serverMsg.type} sx={{ mt: 2 }}>
            {serverMsg.text}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default UserDashboard;
