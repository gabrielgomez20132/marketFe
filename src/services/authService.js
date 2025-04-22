import axios from 'axios';
 // Cambia esto a la URL de tu API
 const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)

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
    localStorage.removeItem('authToken'); // o sessionStorage.removeItem('authToken');
    
    // Si tienes otros datos que guardar en el almacenamiento local (como el usuario), elimínalos también.
    localStorage.removeItem('user');
    
    // Opcional: Realizar una petición a la API para invalidar el token en el servidor (si es necesario)
    // Puedes llamar a una API de logout aquí, si tu backend requiere hacerlo.
  
    console.log('Usuario desconectado');
  };