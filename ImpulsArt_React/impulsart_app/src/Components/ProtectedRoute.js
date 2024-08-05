import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, roles, ...rest }) => {
  // Recupera los roles del usuario desde el localStorage
  const userRoles = JSON.parse(localStorage.getItem('userRoles')) || {};

  // Verifica si el usuario tiene alguno de los roles requeridos
  const hasAccess = roles.includes(userRoles.tipoUsuario);

  // Agrega logs para depuración
  console.log('User Roles:', userRoles);
  console.log('Required Roles:', roles);
  console.log('Has Access:', hasAccess);

  return hasAccess ? <Element {...rest} /> : <Navigate to="/no-access" />;
};

export default ProtectedRoute;