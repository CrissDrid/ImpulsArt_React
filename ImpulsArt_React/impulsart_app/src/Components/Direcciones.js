import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Direcciones() {
  const [userDetails, setUserDetails] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const getUserDirections = () => {
    axios.get(`http://localhost:8086/api/direccion/list/${user.pk_identificacion}`)
      .then((response) => {
        console.log('Datos obtenidos:', response.data.data); // Añadir log para depuración
        setUserDetails(response.data.data);
      })
      .catch((e) => {
        console.error('Error en getUserDirections:', e.response ? e.response.data : e.message);
      });
  };

  useEffect(() => {
    if (user && user.pk_identificacion) {
      getUserDirections();
    }
  }, [user.pk_identificacion]);

  const renderObraCards = () => {
    if (userDetails && userDetails.length > 0) {
      return userDetails.map((direccion) => (
        <div className="obra-card" key={direccion.pk_direccion_id}>
          <div className="obra-info">
            <h5>{`${direccion.calle}, ${direccion.ciudad}, ${direccion.codigo_postal}`}</h5>
          </div>
        </div>
      ));
    } else {
      return <p>No se encontraron direcciones.</p>;
    }
  };

  return (
    <div className="user-data">
      <h2>Mis Direcciones</h2>
      <div className="obras-grid">
        {renderObraCards()}
        <div className="subir-obra">
          <div className="image-placeholder">
            <i className="cross-icon bi bi-plus"></i>
            <p className="text-subirObra">Nueva Dirección</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Direcciones;