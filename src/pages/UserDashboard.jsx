import React, { useContext, useState } from 'react';
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  Stack,
  Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Esquema de validación con Yup (aunque no se usará ya que los campos son solo de lectura)
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
  const { user } = useContext(AuthContext);  // Accede al usuario desde el contexto
  const navigate = useNavigate();

  const [serverMsg, setServerMsg] = useState({ type: '', text: '' });

  const {
    register,
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

  const handleBack = () => {
    navigate('/'); // Redirige a la página principal
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Ver Perfil
        </Typography>

        <form noValidate>
          <Grid container spacing={2}>
            {[ 
              { label: 'Nombre', name: 'nombre' },
              { label: 'Apellido', name: 'apellido' },
              { label: 'DNI', name: 'dni' },
              { label: 'Dirección', name: 'direccion' },
              { label: 'Código Postal', name: 'codigo_postal' },
              { label: 'Nombre de Usuario', name: 'username' }, 
              { label: 'Email', name: 'email', type: 'email' }
            ].map(({ label, name, type = 'text', disabled = true }) => (
              <Grid item xs={12} key={name}>
                <TextField
                  label={label}
                  type={type}
                  fullWidth
                  variant="outlined"
                  {...register(name)}
                  disabled={disabled} // Todos los campos están deshabilitados
                />
              </Grid>
            ))}
          </Grid>
        </form>

        {serverMsg.text && (
          <Alert severity={serverMsg.type} sx={{ mt: 2 }}>
            {serverMsg.text}
          </Alert>
        )}
      </Paper>

      {/* Los botones fuera del Paper, centrados y alineados abajo */}
      <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
        <Stack spacing={2} direction="row">
          {/* Botón para volver */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBack} // Redirige a la página principal
          >
            Volver
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default UserDashboard;
