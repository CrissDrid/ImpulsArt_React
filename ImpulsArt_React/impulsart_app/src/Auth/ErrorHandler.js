import Swal from 'sweetalert2';
import AuthToken from './AuthToken'; // Importa la instancia de Axios

// Añade un interceptor de respuesta para manejar errores globalmente
AuthToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        title: 'Sesión Expirada',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        icon: 'error',
        confirmButtonText: 'Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('authToken');
          window.location.href = '/Login';
        }
      });
    }
    // Puedes manejar otros códigos de estado aquí (403, 500, etc.)
    return Promise.reject(error);
  }
);