import axios from 'axios';
 //URL DESDE .ENV
 const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
 

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        // Suponiendo que la API devuelve el token y los datos del usuario
        const { token, user } = response.data;
        return { token, user };
      } catch (error) {
        console.error("Error de autenticación", error);
        return { token: null, user: null };
      }
  };
  

  // Función de logout
export const logoutUser = () => {
    // Eliminar el token del localStorage o sessionStorage
    localStorage.removeItem('authToken');
    
    localStorage.removeItem('user');
  
    console.log('Usuario desconectado');
  };