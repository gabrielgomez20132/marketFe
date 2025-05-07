// src/pages/UserOrders.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  Divider
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const endpoint = `${API_URL}/orders/user/${user._id}`;

        const { data } = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrders(data);
      } catch (error) {
        const msg = error.response?.data?.message || 'Error al obtener órdenes';
        setErrorMsg(msg);
        console.error('Error backend:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user, token]);

  const handleBack = () => {
    navigate('/');
  };

  // Función para limitar el texto
  const truncateText = (text, maxLength = 20) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Función para mostrar el estado traducido
  const getStatusLabel = (status) => {
    if (status === 'paid') {
      return 'Pagado';
    }
    return status || 'Pendiente';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={5} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Mis Compras
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : errorMsg ? (
          <Alert severity="error" sx={{ textAlign: 'center' }}>
            {errorMsg}
          </Alert>
        ) : orders.length === 0 ? (
          <Alert severity="info" sx={{ textAlign: 'center' }}>
            No tenés órdenes registradas.
          </Alert>
        ) : (
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {orders.map((order, index) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2, height: 'auto', minHeight: 380 }}>
                  <CardHeader
                    title={`Orden #${index + 1}`}
                    subheader={`Fecha: ${new Date(order.createdAt).toLocaleDateString()}`}
                    sx={{ backgroundColor: '#f5f5f5' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      {/* Información general de la orden */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="text.primary">
                          <strong>Total:</strong> ${order.total.toFixed(2)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          <strong>Estado:</strong> {getStatusLabel(order.status)}
                        </Typography>
                      </Grid>

                      {/* Mostrar productos de la orden */}
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Productos:
                          </Typography>
                          {order.items.map((item, idx) => (
                            <Box key={idx} sx={{ mb: 2, pl: 2 }}>
                              <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{
                                  fontWeight: 'bold',
                                  maxWidth: '200px', // Limitar el tamaño del texto
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <strong>{truncateText(item.product.name, 20)}</strong>
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Cantidad:</strong> {item.quantity}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Precio:</strong> ${item.price}
                              </Typography>
                              <Divider sx={{ mt: 1 }} />
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        
      </Paper>
      <Box textAlign="center" sx={{ mt: 3, mb: 2 }}>
        <Button variant="outlined" color="secondary" onClick={handleBack}>
          Volver
        </Button>
      </Box>
      
    </Container>
  );
};

export default UserOrders;
