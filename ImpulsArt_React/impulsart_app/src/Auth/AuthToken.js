import axios from 'axios';

// Crea una instancia de axios con la configuración base
const AuthToken = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
});

// Añade un interceptor de solicitud para incluir el token de autenticación
AuthToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AuthToken;