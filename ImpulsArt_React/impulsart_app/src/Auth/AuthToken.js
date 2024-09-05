import axios from 'axios';
import Swal from 'sweetalert2';

// Crea una instancia de axios con la configuración base
const AuthToken = axios.create({
  baseURL: 'http://localhost:8086/api/', // Cambia esto a la URL base de tu API
});

// Añade un interceptor de solicitud para incluir el token de autenticación
AuthToken.interceptors.request.use(
  (config) => {
    // Obtiene el token de autenticación del localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Añade el token a las cabeceras de la solicitud
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Rechaza la promesa si ocurre un error en la solicitud
    return Promise.reject(error);
  }
);

// Añade un interceptor de respuesta para manejar errores globalmente
AuthToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Manejo de error 401 (Unauthorized)
      Swal.fire({
        title: 'Sesión Expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        icon: 'error',
        confirmButtonText: 'Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirige a la página de inicio de sesión después de que el usuario cierre la alerta
          localStorage.removeItem('authToken');
          window.location.href = '/Login';
        }
      });
    }
    // Rechaza la promesa si ocurre un error en la respuesta
    return Promise.reject(error);
  }
);


export default AuthToken;