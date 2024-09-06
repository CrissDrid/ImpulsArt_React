import { jwtDecode } from 'jwt-decode';

const GetUserInfo = () => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    try {
      // Elimina el prefijo 'Bearer ' si está presente
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      // Decodifica el token
      const decodedToken = jwtDecode(cleanToken);

      // Verificar la expiración del token
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        // Token expirado
        localStorage.removeItem('authToken');
        return { userName: '', rol: [], identificacion: '' };
      }
      
      // Verifica que los datos decodificados sean válidos
      if (decodedToken && decodedToken.userName) {
        return {
          userName: decodedToken.userName,
          rol: decodedToken.rol || [], // Asegúrate de que rol sea un array
          identificacion: decodedToken.identificacion
        };
      } else {
        // Si los datos del token no son válidos, eliminar el token
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      // Eliminar el token si ocurre un error en la decodificación
      localStorage.removeItem('authToken');
    }
  }
  
  // Si no hay token o el token es inválido, devolver valores predeterminados
  return { userName: '', rol: [], identificacion: '' };
};

export default GetUserInfo;