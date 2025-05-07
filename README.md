# MarketApp - Gestión de Productos

MarketApp es una aplicación web que permite la gestión de productos, incluyendo la visualización, edición, eliminación y creación de productos. Esta aplicación consume una API RESTful para manejar los productos y proporciona un sistema de autenticación basado en tokens JWT.

## Características

- Visualización de productos con detalles como ID, descripción, precio y stock.
- Acciones de gestión de productos como **Editar**, **Eliminar** y **Nuevo** (comentadas para ser implementadas).
- Autenticación basada en JWT para proteger el acceso a ciertas funciones.
- Realizar compras con un descuento especifico.
- Categorias
- Ordenes de compras


## Tecnologías utilizadas

- **React**: Librería para la interfaz de usuario.
- **Axios**: Cliente HTTP para hacer peticiones a la API.
- **JWT**: Autenticación y autorización de usuarios.
- **Tailwind CSS**: Framework CSS para diseño de la interfaz.

- React
- React Router DOM
- Axios
- Tailwind CSS
- SweetAlert2
- Tippy.js para tooltips
- Context API (Carrito y Wishlist)
- Vite (dev server)

## Requisitos previos

- Node.js y npm instalados en tu sistema.
- Una API backend que provea los endpoints de productos y maneje la autenticación con JWT.


🔗 Funcionalidades
Vista de productos y categorías

Búsqueda de productos

Carrito de compras

Wishlist

Modal de vista rápida

Paginación

Login y registro de usuarios

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/gabrielgomez20132/marketFe.git


### Instalar dependencias

bash
npm install


### Configurar variables de entorno
Crear archivo `.env`:

VITE_API_URL=http://localhost:5000/api

### Iniciar el servidor

bash
npm run dev
