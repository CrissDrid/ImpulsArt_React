import React, { useState, useEffect } from 'react';
import GetUserInfo from '../Auth/GetUserInfo';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, rol: requiredRoles = [], ...rest }) => {
  const [rol, setRol] = useState([]);

  useEffect(() => {
    const { rol } = GetUserInfo();
    setRol(rol || []);
  }, []);

  const hasAccess = requiredRoles.length > 0 && requiredRoles.some(requiredRoles => requiredRoles.includes(rol));

  return hasAccess ? <Element {...rest} /> : <Navigate to="/no-access" />;
};

export default ProtectedRoute;